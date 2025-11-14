import { KafkaConnector } from './base';
import { KafkaCluster } from '@/types';
import axios from 'axios';

/**
 * Confluent Cloud Connector
 * 
 * Connects to Confluent Cloud using their REST API
 */
export class ConfluentCloudConnector implements KafkaConnector {
  private apiKey: string;
  private apiSecret: string;
  private baseUrl: string;

  constructor(config: Record<string, any>) {
    this.apiKey = config.apiKey;
    this.apiSecret = config.apiSecret;
    this.baseUrl = config.baseUrl || 'https://api.confluent.cloud';
  }

  private async makeRequest(
    endpoint: string,
    method: string = 'GET',
    data?: any
  ): Promise<any> {
    const auth = Buffer.from(`${this.apiKey}:${this.apiSecret}`).toString('base64');

    const response = await axios({
      method,
      url: `${this.baseUrl}${endpoint}`,
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json',
      },
      data,
    });

    return response.data;
  }

  async getClusterInfo(config: Record<string, any>): Promise<KafkaCluster> {
    const { clusterId, environmentId } = config;

    try {
      // Get cluster details from Confluent Cloud API
      const cluster = await this.makeRequest(
        `/cmk/v2/clusters/${clusterId}?environment=${environmentId}`
      );

      // Get cluster endpoints
      const endpoints = await this.makeRequest(
        `/networking/v1/networking/v1/endpoints?environment=${environmentId}&resource=${clusterId}`
      );

      const brokers = endpoints.data?.map((ep: any) => ep.endpoint) || [];

      return {
        id: `confluent-${clusterId}`,
        name: config.name || cluster.spec?.display_name || `Confluent Cloud ${clusterId}`,
        brokers,
        prometheusUrl: config.prometheusUrl || '', // Confluent Cloud metrics via their API
        schemaRegistryUrl: config.schemaRegistryUrl,
        connectUrl: config.connectUrl,
        tls: {
          enabled: true, // Confluent Cloud always uses TLS
        },
        sasl: {
          enabled: true,
          mechanism: 'PLAIN',
          username: this.apiKey,
          password: this.apiSecret,
        },
      };
    } catch (error) {
      console.error('Error fetching Confluent Cloud cluster info:', error);
      throw error;
    }
  }

  async fetchMetrics(config: Record<string, any>): Promise<Record<string, any>> {
    const { clusterId, environmentId } = config;

    try {
      // Fetch metrics from Confluent Cloud Metrics API
      const metrics = await this.makeRequest(
        `/metrics/v1/query?cluster_id=${clusterId}&environment=${environmentId}`
      );

      return {
        ...metrics,
        clusterType: 'confluent-cloud',
      };
    } catch (error) {
      console.error('Error fetching Confluent Cloud metrics:', error);
      // Fallback to basic cluster info
      return {
        clusterType: 'confluent-cloud',
        clusterId,
      };
    }
  }

  async testConnection(config: Record<string, any>): Promise<boolean> {
    try {
      const clusterInfo = await this.getClusterInfo(config);
      
      // Test by fetching cluster info
      if (clusterInfo.brokers.length > 0) {
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Confluent Cloud connection test failed:', error);
      return false;
    }
  }

  async getConsumerGroups(config: Record<string, any>): Promise<string[]> {
    const { clusterId, environmentId } = config;

    try {
      // Fetch consumer groups from Confluent Cloud API
      const groups = await this.makeRequest(
        `/kafka/v3/clusters/${clusterId}/consumer-groups?environment=${environmentId}`
      );

      return groups.data?.map((g: any) => g.consumer_group_id) || [];
    } catch (error) {
      console.error('Error fetching consumer groups from Confluent Cloud:', error);
      return [];
    }
  }
}

