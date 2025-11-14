import { Kafka, Admin, logLevel } from 'kafkajs';

let adminClient: Admin | null = null;
let kafkaClient: Kafka | null = null;

export interface KafkaConfig {
  brokers: string[];
  ssl?: boolean;
  sasl?: {
    mechanism: 'plain' | 'scram-sha-256' | 'scram-sha-512';
    username: string;
    password: string;
  };
}

export function createKafkaAdmin(config: KafkaConfig): Admin {
  if (kafkaClient && adminClient) {
    return adminClient;
  }

  kafkaClient = new Kafka({
    clientId: 'metamorphosis-admin',
    brokers: config.brokers,
    logLevel: logLevel.ERROR,
    ssl: config.ssl || false,
    sasl: config.sasl || undefined,
  });

  adminClient = kafkaClient.admin();
  return adminClient;
}

export async function getConsumerGroups(admin: Admin): Promise<string[]> {
  try {
    const groups = await admin.listGroups();
    return groups.groups.map((g) => g.groupId);
  } catch (error) {
    console.error('Error listing consumer groups:', error);
    return [];
  }
}

export async function getConsumerGroupOffsets(
  admin: Admin,
  groupId: string
): Promise<Map<string, Map<number, number>>> {
  const offsets = new Map<string, Map<number, number>>();

  try {
    const describedGroups = await admin.describeGroups([groupId]);
    const group = describedGroups.groups[0];

    if (!group || group.members.length === 0) {
      return offsets;
    }

    // Get committed offsets for the consumer group
    const topicPartitions = new Map<string, number[]>();
    
    // List all topics to get partition information
    const topics = await admin.listTopics();
    
    for (const topic of topics) {
      const metadata = await admin.fetchTopicMetadata({ topics: [topic] });
      const topicMetadata = metadata.topics.find((t) => t.name === topic);
      if (topicMetadata) {
        const partitions = topicMetadata.partitions.map((p) => p.partitionId);
        topicPartitions.set(topic, partitions);
      }
    }

    // For each topic-partition, get the committed offset
    for (const [topic, partitions] of topicPartitions.entries()) {
      const partitionMap = new Map<number, number>();
      
      for (const partition of partitions) {
        try {
          const offsets = await admin.fetchOffsets({
            groupId,
            topics: [
              {
                topic,
                partitions: [{ partition }],
              },
            ],
          });

          const topicOffsets = offsets.find((o) => o.topic === topic);
          if (topicOffsets) {
            const partitionOffset = topicOffsets.partitions.find((p) => p.partition === partition);
            if (partitionOffset) {
              partitionMap.set(partition, Number(partitionOffset.offset));
            }
          }
        } catch (error) {
          console.error(`Error fetching offset for ${topic}:${partition}:`, error);
        }
      }

      if (partitionMap.size > 0) {
        offsets.set(topic, partitionMap);
      }
    }
  } catch (error) {
    console.error(`Error getting offsets for group ${groupId}:`, error);
  }

  return offsets;
}

export async function getTopicEndOffsets(
  admin: Admin,
  topic: string
): Promise<Map<number, number>> {
  const endOffsets = new Map<number, number>();

  try {
    const metadata = await admin.fetchTopicMetadata({ topics: [topic] });
    const topicMetadata = metadata.topics.find((t) => t.name === topic);
    
    if (!topicMetadata) {
      return endOffsets;
    }

    const partitions = topicMetadata.partitions.map((p) => p.partitionId);
    
    // Use a Kafka consumer to fetch high watermarks (end offsets)
    const kafka = admin['kafka'];
    const consumer = kafka.consumer({ groupId: 'metamorphosis-offset-fetcher' });
    
    await consumer.connect();
    
    const partitionOffsets = await Promise.all(
      partitions.map(async (partition) => {
        const highWatermark = await consumer.seek({
          topic,
          partition,
          offset: '-1', // Get the latest offset
        });
        
        // Get the actual high watermark
        const topicPartition = { topic, partition };
        const offsets = await consumer.offsets({ topics: [{ topic, partitions: [{ partition }] }] });
        
        // Find the high watermark for this partition
        const topicOffset = offsets.find((o) => o.topic === topic);
        if (topicOffset) {
          const partitionOffset = topicOffset.partitions.find((p) => p.partition === partition);
          if (partitionOffset) {
            return { partition, offset: Number(partitionOffset.offset) };
          }
        }
        
        return { partition, offset: 0 };
      })
    );
    
    await consumer.disconnect();

    partitionOffsets.forEach(({ partition, offset }) => {
      endOffsets.set(partition, offset);
    });
  } catch (error) {
    console.error(`Error getting end offsets for topic ${topic}:`, error);
  }

  return endOffsets;
}

// Use a consumer to get high watermarks (end offsets)
async function getHighWatermarks(
  kafka: any,
  topics: string[]
): Promise<Map<string, Map<number, number>>> {
  const highWatermarks = new Map<string, Map<number, number>>();
  
  try {
    const consumer = kafka.consumer({ groupId: `metamorphosis-offset-checker-${Date.now()}` });
    await consumer.connect();

    for (const topic of topics) {
      // Get partition metadata
      const admin = kafka.admin();
      await admin.connect();
      const metadata = await admin.fetchTopicMetadata({ topics: [topic] });
      await admin.disconnect();
      
      const topicMetadata = metadata.topics.find((t) => t.name === topic);
      if (!topicMetadata) continue;

      const partitions = topicMetadata.partitions.map((p) => p.partitionId);
      const partitionMap = new Map<number, number>();

      // Subscribe to get partition info
      await consumer.subscribe({ topics: [topic], fromBeginning: false });
      
      // Wait a bit for subscription
      await new Promise((resolve) => setTimeout(resolve, 1000));

      for (const partition of partitions) {
        try {
          // Get high watermark using seek
          const offsets = await consumer.offsets({ topics: [{ topic, partitions: [{ partition }] }] });
          const topicOffset = offsets.find((o) => o.topic === topic);
          
          if (topicOffset) {
            const partitionOffset = topicOffset.partitions.find((p) => p.partition === partition);
            if (partitionOffset) {
              partitionMap.set(partition, Number(partitionOffset.offset));
            }
          }
        } catch (error) {
          console.error(`Error getting high watermark for ${topic}:${partition}:`, error);
        }
      }

      if (partitionMap.size > 0) {
        highWatermarks.set(topic, partitionMap);
      }
    }

    await consumer.disconnect();
  } catch (error) {
    console.error('Error getting high watermarks:', error);
  }

  return highWatermarks;
}

// Simplified version using Admin API only
export async function calculateConsumerLag(
  admin: Admin,
  groupId: string
): Promise<Array<{ topic: string; partition: number; lag: number; offset: number; endOffset: number }>> {
  const lagData: Array<{ topic: string; partition: number; lag: number; offset: number; endOffset: number }> = [];

  try {
    // Get committed offsets
    const committedOffsets = await getConsumerGroupOffsets(admin, groupId);
    
    if (committedOffsets.size === 0) {
      return lagData;
    }

    // Get high watermarks for all topics
    const topics = Array.from(committedOffsets.keys());
    const kafka = (admin as any).kafka;
    const highWatermarks = await getHighWatermarks(kafka, topics);
    
    // For each topic, calculate lag
    for (const [topic, partitionOffsets] of committedOffsets.entries()) {
      const topicHighWatermarks = highWatermarks.get(topic) || new Map<number, number>();

      for (const [partition, committedOffset] of partitionOffsets.entries()) {
        const endOffset = topicHighWatermarks.get(partition) || 0;
        const lag = Math.max(0, endOffset - committedOffset);
        
        lagData.push({
          topic,
          partition,
          lag,
          offset: committedOffset,
          endOffset,
        });
      }
    }
  } catch (error) {
    console.error(`Error calculating lag for group ${groupId}:`, error);
  }

  return lagData;
}

