import { KafkaCluster } from '@/types';

/**
 * Base connector interface for different Kafka providers
 */
export interface KafkaConnector {
  /**
   * Get cluster metadata
   */
  getClusterInfo(config: Record<string, any>): Promise<KafkaCluster>;

  /**
   * Fetch metrics from the provider's API
   */
  fetchMetrics(config: Record<string, any>): Promise<Record<string, any>>;

  /**
   * Test connection to the cluster
   */
  testConnection(config: Record<string, any>): Promise<boolean>;

  /**
   * Get consumer group information
   */
  getConsumerGroups(config: Record<string, any>): Promise<string[]>;
}

export interface ConnectorConfig {
  type: 'aws-msk' | 'confluent-cloud' | 'redpanda' | 'standard';
  [key: string]: any;
}

