import axios from 'axios';

export interface MetricValue {
  instance?: string;
  job?: string;
  partition?: string | null;
  topic?: string | null;
  request?: string | null;
  value: string;
}

export interface MetricDataPoint {
  timestamp: number;
  value: number;
}

export interface ChartData {
  metric: Record<string, string>;
  output: {
    x: number[];
    y: number[];
  };
}

const queriesCount = {
  kafka_cluster_partition_insyncreplicascount: [],
  kafka_cluster_partition_underreplicated: [],
  kafka_controller_kafkacontroller_offlinepartitionscount: [],
  kafka_network_requestmetrics_requestbytes_count: [],
  kafka_controller_kafkacontroller_activebrokercount: [],
  kafka_controller_kafkacontroller_activecontrollercount: [],
} as Record<string, MetricValue[]>;

const queriesChart = {
  kafka_server_brokertopicmetrics_bytesin_total: {},
  kafka_server_brokertopicmetrics_bytesout_total: {},
  kafka_controller_controllerstats_autoleaderbalancerateandtimems: {},
  jvm_memory_bytes_used: {},
  kafka_network_requestmetrics_requestqueuetimems: {},
  kafka_network_requestmetrics_responsesendtimems: {},
  kafka_server_brokertopicmetrics_totalproducerequests_total: {},
  kafka_consumergroup_group_lag: {},
  kafka_consumer_consumer_coordinator_metrics_rebalance_total: {},
  kafka_producer_producer_metrics_io_ratio: {},
  kafka_producer_producer_metrics_record_error_rate: {},
} as Record<string, ChartData[]>;

let ipInCache = { ip: 'Placeholder' };

export function setPrometheusUrl(ip: string): void {
  ipInCache.ip = ip;
}

export function getPrometheusUrl(): string {
  return ipInCache.ip;
}

export async function queryCountMetrics(
  ip: string
): Promise<Record<string, MetricValue[]>> {
  const results: Record<string, MetricValue[]> = { ...queriesCount };

  for (const key of Object.keys(queriesCount)) {
    try {
      const response = await axios.get(`http://${ip}/api/v1/query`, {
        params: {
          query: key,
        },
      });

      const retrievedData: MetricValue[] = [];
      response.data.data.result.forEach((x: any) => {
        const obj: MetricValue = {
          instance: x.metric.instance,
          job: x.metric.job,
          partition: x.metric.partition ? x.metric.partition : null,
          topic: x.metric.topic ? x.metric.topic : null,
          request: x.metric.request ? x.metric.request : null,
          value: x.value[1],
        };
        retrievedData.push(obj);
      });

      results[key] = retrievedData;
    } catch (err: any) {
      console.error(`Error querying ${key}:`, err.code || err.message);
    }
  }

  return results;
}

export async function queryChartMetrics(
  ip: string | { ip: string },
  range: number = 15
): Promise<Record<string, ChartData[]>> {
  const ipAddress = typeof ip === 'object' ? ip.ip : ip;
  range = Number(range) * 60;
  const endTime = Math.round(new Date().getTime() / 1000);
  let startTime: number;
  let step: number;

  switch (range) {
    case 900:
      startTime = endTime - 900;
      step = 60;
      break;
    case 1800:
      startTime = endTime - 1800;
      step = 120;
      break;
    case 3600:
      startTime = endTime - 3600;
      step = 240;
      break;
    case 21600:
      startTime = endTime - 21600;
      step = 1440;
      break;
    default:
      startTime = endTime - 900;
      step = 60;
  }

  const results: Record<string, ChartData[]> = { ...queriesChart };

  for (const key of Object.keys(queriesChart)) {
    try {
      const response = await axios.get(`http://${ipAddress}/api/v1/query_range`, {
        params: {
          query: key,
          start: startTime,
          end: endTime,
          step: step,
        },
      });

      const retrievedData: ChartData[] = [];
      response.data.data.result.forEach((el: any) => {
        const obj: ChartData = {
          metric: el.metric,
          output: {
            x: [],
            y: [],
          },
        };

        for (let i = 0; i < el.values.length; i++) {
          obj.output.x.push(el.values[i][0]);
          obj.output.y.push(Number(el.values[i][1]));
        }

        retrievedData.push(obj);
      });

      results[key] = retrievedData;
    } catch (err: any) {
      console.error(`Error querying chart ${key}:`, err.code || err.message);
    }
  }

  return results;
}

export async function queryAllMetrics(
  ip: string,
  range: number = 15
): Promise<Record<string, any>> {
  const [countMetrics, chartMetrics] = await Promise.all([
    queryCountMetrics(ip),
    queryChartMetrics(ip, range),
  ]);

  return {
    ...countMetrics,
    ...chartMetrics,
  };
}

