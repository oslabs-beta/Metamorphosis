import { KafkaConnector } from './base';
import { KafkaCluster } from '@/types';
import { createKafkaAdmin } from '@/lib/kafka/admin';

/**
 * Redpanda Connector
 * 
 * Connects to Redpanda clusters (Kafka-compatible)
 */
export class RedpandaConnector implements KafkaConnector {
  async getClusterInfo(config: Record<string, any>): Promise<KafkaCluster> {
    const { brokers, adminApiUrl } = config;

    return {
      id: `redpanda-${config.clusterId || Date.now()}`,
      name: config.name || 'Redpanda Cluster',
      brokers: Array.isArray(brokers) ? brokers : brokers.split(',').map((b: string) => b.trim()),
      prometheusUrl: config.prometheusUrl || adminApiUrl || '',
      tls: config.tls || {
        enabled: false,
      },
      sasl: config.sasl || {
        enabled: false,
        mechanism: 'PLAIN',
      },
    };
  }

  async fetchMetrics(config: Record<string, any>): Promise<Record<string, any>> {
    const clusterInfo = await this.getClusterInfo(config);

    // Redpanda is Kafka-compatible, so we can use standard Kafka AdminClient
    const admin = createKafkaAdmin({
      brokers: clusterInfo.brokers,
      ssl: clusterInfo.tls?.enabled,
      sasl: clusterInfo.sasl?.enabled ? {
        mechanism: clusterInfo.sasl.mechanism as 'plain' | 'scram-sha-256' | 'scram-sha-512',
        username: clusterInfo.sasl.username || '',
        password: clusterInfo.sasl.password || '',
      } : undefined,
    });

    await admin.connect();

    try {
      const topics = await admin.listTopics();
      const groups = await admin.listGroups();

      // If Redpanda Admin API is available, fetch additional metrics
      let redpandaMetrics = {};
      if (config.adminApiUrl) {
        try {
          const response = await fetch(`${config.adminApiUrl}/v1/metrics/prometheus`);
          if (response.ok) {
            const metricsText = await response.text();
            // Parse Prometheus format metrics
            redpandaMetrics = { prometheusMetrics: metricsText };
          }
        } catch (error) {
          console.warn('Could not fetch Redpanda Admin API metrics:', error);
        }
      }

      return {
        topics: topics.length,
        consumerGroups: groups.groups.length,
        clusterType: 'redpanda',
        ...redpandaMetrics,
      };
    } finally {
      await admin.disconnect();
    }
  }

  async testConnection(config: Record<string, any>): Promise<boolean> {
    try {
      const clusterInfo = await this.getClusterInfo(config);
      const admin = createKafkaAdmin({
        brokers: clusterInfo.brokers,
        ssl: clusterInfo.tls?.enabled,
        sasl: clusterInfo.sasl?.enabled ? {
          mechanism: clusterInfo.sasl.mechanism as 'plain' | 'scram-sha-256' | 'scram-sha-512',
          username: clusterInfo.sasl.username || '',
          password: clusterInfo.sasl.password || '',
        } : undefined,
      });

      await admin.connect();
      await admin.listTopics();
      await admin.disconnect();

      return true;
    } catch (error) {
      console.error('Redpanda connection test failed:', error);
      return false;
    }
  }

  async getConsumerGroups(config: Record<string, any>): Promise<string[]> {
    const clusterInfo = await this.getClusterInfo(config);
    const admin = createKafkaAdmin({
      brokers: clusterInfo.brokers,
      ssl: clusterInfo.tls?.enabled,
      sasl: clusterInfo.sasl?.enabled ? {
        mechanism: clusterInfo.sasl.mechanism as 'plain' | 'scram-sha-256' | 'scram-sha-512',
        username: clusterInfo.sasl.username || '',
        password: clusterInfo.sasl.password || '',
      } : undefined,
    });

    await admin.connect();

    try {
      const groups = await admin.listGroups();
      return groups.groups.map((g) => g.groupId);
    } finally {
      await admin.disconnect();
    }
  }
}

