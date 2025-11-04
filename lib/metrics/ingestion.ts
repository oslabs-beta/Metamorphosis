import { Pool } from 'pg';
import { MetricDataPoint, TimeSeriesData } from '@/types';

let dbPool: Pool | null = null;

export function initializeDatabase(): Pool {
  if (!dbPool) {
    dbPool = new Pool({
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432', 10),
      database: process.env.DB_NAME || 'metamorphosis',
      user: process.env.DB_USER || 'metamorphosis',
      password: process.env.DB_PASSWORD || 'metamorphosis',
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    });

    // Create tables if they don't exist
    createTables(dbPool);
  }

  return dbPool;
}

/**
 * Create TimescaleDB hypertables for time-series data
 */
async function createTables(pool: Pool): Promise<void> {
  const client = await pool.connect();
  
  try {
    // Enable TimescaleDB extension
    await client.query('CREATE EXTENSION IF NOT EXISTS timescaledb;');

    // Create metrics table
    await client.query(`
      CREATE TABLE IF NOT EXISTS metrics (
        time TIMESTAMPTZ NOT NULL,
        metric_name TEXT NOT NULL,
        value DOUBLE PRECISION NOT NULL,
        labels JSONB,
        cluster_id TEXT,
        broker_id TEXT
      );
    `);

    // Convert to hypertable if not already
    await client.query(`
      SELECT create_hypertable('metrics', 'time', if_not_exists => TRUE);
    `);

    // Create indexes
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_metrics_name_time 
      ON metrics (metric_name, time DESC);
    `);

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_metrics_cluster 
      ON metrics (cluster_id, time DESC);
    `);

    // Create alert events table
    await client.query(`
      CREATE TABLE IF NOT EXISTS alert_events (
        id TEXT PRIMARY KEY,
        rule_id TEXT NOT NULL,
        status TEXT NOT NULL,
        value DOUBLE PRECISION NOT NULL,
        timestamp BIGINT NOT NULL,
        resolved_at BIGINT,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    // Create cluster config table
    await client.query(`
      CREATE TABLE IF NOT EXISTS clusters (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        brokers TEXT[] NOT NULL,
        prometheus_url TEXT NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    console.log('Database tables created successfully');
  } catch (error) {
    console.error('Error creating tables:', error);
    // Don't throw - allow app to continue if tables already exist
  } finally {
    client.release();
  }
}

/**
 * Ingest metrics into TimescaleDB
 */
export async function ingestMetrics(
  metrics: TimeSeriesData[],
  clusterId?: string
): Promise<void> {
  const pool = initializeDatabase();
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const values: any[] = [];
    const placeholders: string[] = [];
    let paramIndex = 1;

    for (const series of metrics) {
      for (const point of series.datapoints) {
        values.push(
          new Date(point.timestamp * 1000), // Convert Unix timestamp to Date
          series.metric,
          point.value,
          JSON.stringify(point.labels || series.labels || {}),
          clusterId || null,
          series.labels?.broker || null
        );
        placeholders.push(
          `($${paramIndex}, $${paramIndex + 1}, $${paramIndex + 2}, $${paramIndex + 3}::jsonb, $${paramIndex + 4}, $${paramIndex + 5})`
        );
        paramIndex += 6;
      }
    }

    if (values.length > 0) {
      const query = `
        INSERT INTO metrics (time, metric_name, value, labels, cluster_id, broker_id)
        VALUES ${placeholders.join(', ')}
        ON CONFLICT DO NOTHING;
      `;

      await client.query(query, values);
    }

    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error ingesting metrics:', error);
    throw error;
  } finally {
    client.release();
  }
}

/**
 * Query historical metrics
 */
export async function queryHistoricalMetrics(
  metricName: string,
  startTime: number,
  endTime: number,
  clusterId?: string,
  brokerId?: string
): Promise<MetricDataPoint[]> {
  const pool = initializeDatabase();
  const client = await pool.connect();

  try {
    let query = `
      SELECT 
        EXTRACT(EPOCH FROM time)::bigint as timestamp,
        value,
        labels
      FROM metrics
      WHERE metric_name = $1
        AND time >= $2
        AND time <= $3
    `;

    const params: any[] = [
      metricName,
      new Date(startTime * 1000),
      new Date(endTime * 1000),
    ];

    if (clusterId) {
      query += ' AND cluster_id = $' + (params.length + 1);
      params.push(clusterId);
    }

    if (brokerId) {
      query += ' AND broker_id = $' + (params.length + 1);
      params.push(brokerId);
    }

    query += ' ORDER BY time ASC;';

    const result = await client.query(query, params);

    return result.rows.map((row) => ({
      timestamp: Number(row.timestamp),
      value: parseFloat(row.value),
      labels: row.labels || {},
    }));
  } catch (error) {
    console.error('Error querying historical metrics:', error);
    throw error;
  } finally {
    client.release();
  }
}

/**
 * Batch ingest metrics from Prometheus query result
 */
export async function ingestPrometheusMetrics(
  prometheusData: any,
  clusterId?: string
): Promise<void> {
  const timeSeriesData: TimeSeriesData[] = [];

  // Convert Prometheus response format to TimeSeriesData
  if (prometheusData.data && prometheusData.data.result) {
    for (const result of prometheusData.data.result) {
      const datapoints: MetricDataPoint[] = result.values.map(([timestamp, value]: [string, string]) => ({
        timestamp: Number(timestamp),
        value: parseFloat(value),
        labels: result.metric || {},
      }));

      timeSeriesData.push({
        metric: prometheusData.metric || 'unknown',
        labels: result.metric || {},
        datapoints,
      });
    }
  }

  if (timeSeriesData.length > 0) {
    await ingestMetrics(timeSeriesData, clusterId);
  }
}

/**
 * Get retention policy settings
 */
export async function setRetentionPolicy(days: number): Promise<void> {
  const pool = initializeDatabase();
  const client = await pool.connect();

  try {
    await client.query(`
      SELECT add_retention_policy('metrics', INTERVAL '${days} days');
    `);
    console.log(`Retention policy set to ${days} days`);
  } catch (error) {
    console.error('Error setting retention policy:', error);
  } finally {
    client.release();
  }
}

