// Re-export existing types
export * from '../types';

// Additional types for Next.js and observability platform
export interface KafkaCluster {
  id: string;
  name: string;
  brokers: string[];
  prometheusUrl: string;
  schemaRegistryUrl?: string;
  connectUrl?: string;
  tls?: {
    enabled: boolean;
    certPath?: string;
    keyPath?: string;
    caPath?: string;
  };
  sasl?: {
    enabled: boolean;
    mechanism: 'PLAIN' | 'SCRAM-SHA-256' | 'SCRAM-SHA-512' | 'GSSAPI';
    username?: string;
    password?: string;
  };
}

export interface ConsumerGroup {
  groupId: string;
  state: string;
  members: number;
  protocol: string;
}

export interface PartitionLag {
  topic: string;
  partition: number;
  consumerGroup: string;
  lag: number;
  offset: number;
  endOffset: number;
}

export interface BrokerMetrics {
  brokerId: string;
  jvmHeapUsed: number;
  jvmHeapMax: number;
  gcPauseTime: number;
  threadCount: number;
  diskReadBytes: number;
  diskWriteBytes: number;
  networkInBytes: number;
  networkOutBytes: number;
  timestamp: number;
}

export interface AlertRule {
  id: string;
  name: string;
  metric: string;
  threshold: number;
  operator: 'gt' | 'lt' | 'eq' | 'gte' | 'lte';
  duration: number; // seconds
  enabled: boolean;
  notificationChannels: string[];
}

export interface AlertEvent {
  id: string;
  ruleId: string;
  status: 'firing' | 'resolved';
  value: number;
  timestamp: number;
  resolvedAt?: number;
}

export interface MetricQuery {
  metric: string;
  labels?: Record<string, string>;
  startTime?: number;
  endTime?: number;
  step?: number;
}

export interface MetricDataPoint {
  timestamp: number;
  value: number;
  labels?: Record<string, string>;
}

export interface TimeSeriesData {
  metric: string;
  labels: Record<string, string>;
  datapoints: MetricDataPoint[];
}

