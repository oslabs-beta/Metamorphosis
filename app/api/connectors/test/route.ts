import { NextRequest, NextResponse } from 'next/server';
import { createConnector } from '@/lib/connectors/factory';
import { ConnectorConfig } from '@/lib/connectors/base';

// POST /api/connectors/test - Test connection to a Kafka cluster
export async function POST(request: NextRequest) {
  try {
    const body: ConnectorConfig = await request.json();

    if (!body.type) {
      return NextResponse.json(
        { error: 'Missing required field: type' },
        { status: 400 }
      );
    }

    const connector = createConnector(body);
    const connected = await connector.testConnection(body);

    if (connected) {
      const clusterInfo = await connector.getClusterInfo(body);
      
      return NextResponse.json({
        success: true,
        cluster: {
          id: clusterInfo.id,
          name: clusterInfo.name,
          brokers: clusterInfo.brokers,
        },
      });
    } else {
      return NextResponse.json(
        { success: false, error: 'Failed to connect to cluster' },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error('Error testing connector:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Connection test failed' },
      { status: 500 }
    );
  }
}

