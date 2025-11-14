import { KafkaCluster } from '@/types';
import { Pool } from 'pg';
import { initializeDatabase } from '@/lib/metrics/ingestion';

class ClusterManager {
  private pool: Pool;

  constructor() {
    this.pool = initializeDatabase();
  }

  /**
   * Add or update a cluster configuration
   */
  async saveCluster(cluster: KafkaCluster): Promise<void> {
    const client = await this.pool.connect();
    
    try {
      await client.query(`
        INSERT INTO clusters (id, name, brokers, prometheus_url)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (id) 
        DO UPDATE SET 
          name = $2,
          brokers = $3,
          prometheus_url = $4,
          updated_at = NOW();
      `, [
        cluster.id,
        cluster.name,
        cluster.brokers,
        cluster.prometheusUrl,
      ]);
    } finally {
      client.release();
    }
  }

  /**
   * Get a cluster by ID
   */
  async getCluster(clusterId: string): Promise<KafkaCluster | null> {
    const client = await this.pool.connect();
    
    try {
      const result = await client.query(
        'SELECT * FROM clusters WHERE id = $1',
        [clusterId]
      );

      if (result.rows.length === 0) {
        return null;
      }

      const row = result.rows[0];
      return {
        id: row.id,
        name: row.name,
        brokers: row.brokers,
        prometheusUrl: row.prometheus_url,
        schemaRegistryUrl: null,
        connectUrl: null,
      };
    } finally {
      client.release();
    }
  }

  /**
   * Get all clusters
   */
  async getAllClusters(): Promise<KafkaCluster[]> {
    const client = await this.pool.connect();
    
    try {
      const result = await client.query('SELECT * FROM clusters ORDER BY name');

      return result.rows.map((row) => ({
        id: row.id,
        name: row.name,
        brokers: row.brokers,
        prometheusUrl: row.prometheus_url,
        schemaRegistryUrl: null,
        connectUrl: null,
      }));
    } finally {
      client.release();
    }
  }

  /**
   * Delete a cluster
   */
  async deleteCluster(clusterId: string): Promise<void> {
    const client = await this.pool.connect();
    
    try {
      await client.query('DELETE FROM clusters WHERE id = $1', [clusterId]);
    } finally {
      client.release();
    }
  }
}

// Singleton instance
let clusterManagerInstance: ClusterManager | null = null;

export function getClusterManager(): ClusterManager {
  if (!clusterManagerInstance) {
    clusterManagerInstance = new ClusterManager();
  }
  return clusterManagerInstance;
}

