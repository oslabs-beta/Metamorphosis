import { KafkaConnector, ConnectorConfig } from './base';
import { AWSMSKConnector } from './aws-msk';
import { ConfluentCloudConnector } from './confluent';
import { RedpandaConnector } from './redpanda';

/**
 * Factory to create appropriate connector based on config type
 */
export function createConnector(config: ConnectorConfig): KafkaConnector {
  switch (config.type) {
    case 'aws-msk':
      return new AWSMSKConnector();
    
    case 'confluent-cloud':
      return new ConfluentCloudConnector(config);
    
    case 'redpanda':
      return new RedpandaConnector();
    
    case 'standard':
    default:
      // Standard Kafka connector uses the base Kafka AdminClient
      // Return a simple wrapper
      return {
        getClusterInfo: async (cfg) => ({
          id: cfg.id || `standard-${Date.now()}`,
          name: cfg.name || 'Standard Kafka Cluster',
          brokers: Array.isArray(cfg.brokers) ? cfg.brokers : cfg.brokers.split(','),
          prometheusUrl: cfg.prometheusUrl || '',
          tls: cfg.tls,
          sasl: cfg.sasl,
        }),
        fetchMetrics: async () => ({}),
        testConnection: async () => true,
        getConsumerGroups: async () => [],
      };
  }
}

