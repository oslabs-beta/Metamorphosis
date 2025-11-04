import { NextRequest, NextResponse } from 'next/server';
import { createKafkaAdmin, getConsumerGroups, calculateConsumerLag } from '@/lib/kafka/admin';
import { KafkaConfig } from '@/lib/kafka/admin';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const brokers = searchParams.get('brokers');
    const groupId = searchParams.get('groupId');

    if (!brokers) {
      return NextResponse.json(
        { error: 'Brokers parameter is required' },
        { status: 400 }
      );
    }

    const brokerList = brokers.split(',').map((b) => b.trim());
    
    const config: KafkaConfig = {
      brokers: brokerList,
      ssl: searchParams.get('ssl') === 'true',
      sasl: searchParams.get('sasl') === 'true'
        ? {
            mechanism: (searchParams.get('saslMechanism') as 'plain' | 'scram-sha-256' | 'scram-sha-512') || 'plain',
            username: searchParams.get('saslUsername') || '',
            password: searchParams.get('saslPassword') || '',
          }
        : undefined,
    };

    const admin = createKafkaAdmin(config);
    await admin.connect();

    try {
      if (groupId) {
        // Get lag for specific consumer group
        const lagData = await calculateConsumerLag(admin, groupId);
        return NextResponse.json({ lagData });
      } else {
        // List all consumer groups
        const groups = await getConsumerGroups(admin);
        return NextResponse.json({ groups });
      }
    } finally {
      await admin.disconnect();
    }
  } catch (error: any) {
    console.error('Error fetching consumer lag:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch consumer lag' },
      { status: 500 }
    );
  }
}

