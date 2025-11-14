import { MetricDataPoint } from '@/types';

export interface TrendAnalysis {
  trend: 'increasing' | 'decreasing' | 'stable';
  rate: number; // Rate of change per unit time
  average: number;
  stdDev: number;
  min: number;
  max: number;
  anomaly: boolean;
  anomalyScore: number; // 0-1, higher = more anomalous
}

/**
 * Calculate trend analysis for time-series data
 */
export function analyzeTrend(
  data: MetricDataPoint[],
  windowSize: number = 10
): TrendAnalysis {
  if (data.length === 0) {
    return {
      trend: 'stable',
      rate: 0,
      average: 0,
      stdDev: 0,
      min: 0,
      max: 0,
      anomaly: false,
      anomalyScore: 0,
    };
  }

  const values = data.map((d) => d.value);
  const timestamps = data.map((d) => d.timestamp);

  // Calculate basic statistics
  const average = values.reduce((sum, val) => sum + val, 0) / values.length;
  const variance =
    values.reduce((sum, val) => sum + Math.pow(val - average, 2), 0) /
    values.length;
  const stdDev = Math.sqrt(variance);
  const min = Math.min(...values);
  const max = Math.max(...values);

  // Calculate trend using linear regression
  const n = values.length;
  const sumX = timestamps.reduce((sum, t) => sum + t, 0);
  const sumY = values.reduce((sum, v) => sum + v, 0);
  const sumXY = timestamps.reduce(
    (sum, t, i) => sum + t * values[i],
    0
  );
  const sumXX = timestamps.reduce((sum, t) => sum + t * t, 0);

  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  const rate = slope; // Rate of change per second

  // Determine trend direction
  let trend: 'increasing' | 'decreasing' | 'stable';
  if (Math.abs(rate) < stdDev * 0.1) {
    trend = 'stable';
  } else if (rate > 0) {
    trend = 'increasing';
  } else {
    trend = 'decreasing';
  }

  // Anomaly detection using moving average and standard deviation
  const window = Math.min(windowSize, Math.floor(n / 2));
  const recentValues = values.slice(-window);
  const recentAverage =
    recentValues.reduce((sum, val) => sum + val, 0) / recentValues.length;
  const recentStdDev = Math.sqrt(
    recentValues.reduce(
      (sum, val) => sum + Math.pow(val - recentAverage, 2),
      0
    ) / recentValues.length
  );

  // Check if recent values deviate significantly from overall average
  const deviation = Math.abs(recentAverage - average);
  const anomalyScore = Math.min(1, deviation / (stdDev * 2)); // Normalize to 0-1
  const anomaly = anomalyScore > 0.7; // Threshold for anomaly detection

  return {
    trend,
    rate,
    average,
    stdDev,
    min,
    max,
    anomaly,
    anomalyScore,
  };
}

/**
 * Compare two time periods and identify changes
 */
export function comparePeriods(
  period1: MetricDataPoint[],
  period2: MetricDataPoint[]
): {
  change: number; // Percentage change
  direction: 'increase' | 'decrease' | 'stable';
  significance: 'high' | 'medium' | 'low';
} {
  if (period1.length === 0 || period2.length === 0) {
    return {
      change: 0,
      direction: 'stable',
      significance: 'low',
    };
  }

  const avg1 =
    period1.reduce((sum, d) => sum + d.value, 0) / period1.length;
  const avg2 =
    period2.reduce((sum, d) => sum + d.value, 0) / period2.length;

  const change = ((avg2 - avg1) / avg1) * 100;

  let direction: 'increase' | 'decrease' | 'stable';
  if (Math.abs(change) < 5) {
    direction = 'stable';
  } else if (change > 0) {
    direction = 'increase';
  } else {
    direction = 'decrease';
  }

  let significance: 'high' | 'medium' | 'low';
  const absChange = Math.abs(change);
  if (absChange > 50) {
    significance = 'high';
  } else if (absChange > 20) {
    significance = 'medium';
  } else {
    significance = 'low';
  }

  return {
    change,
    direction,
    significance,
  };
}

/**
 * Detect anomalies using Z-score method
 */
export function detectAnomalies(
  data: MetricDataPoint[],
  threshold: number = 3
): MetricDataPoint[] {
  if (data.length === 0) return [];

  const values = data.map((d) => d.value);
  const average = values.reduce((sum, val) => sum + val, 0) / values.length;
  const stdDev = Math.sqrt(
    values.reduce((sum, val) => sum + Math.pow(val - average, 2), 0) /
      values.length
  );

  if (stdDev === 0) return [];

  return data.filter((point) => {
    const zScore = Math.abs((point.value - average) / stdDev);
    return zScore > threshold;
  });
}

