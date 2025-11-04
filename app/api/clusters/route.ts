import { NextRequest, NextResponse } from 'next/server';
import { getClusterManager } from '@/lib/clusters/manager';
import { KafkaCluster } from '@/types';

// GET /api/clusters - List all clusters
export async function GET() {
  try {
    const manager = getClusterManager();
    const clusters = await manager.getAllClusters();
    return NextResponse.json({ clusters });
  } catch (error: any) {
    console.error('Error fetching clusters:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch clusters' },
      { status: 500 }
    );
  }
}

// POST /api/clusters - Create a new cluster
export async function POST(request: NextRequest) {
  try {
    const body: KafkaCluster = await request.json();

    // Validate required fields
    if (!body.name || !body.brokers || !body.prometheusUrl) {
      return NextResponse.json(
        { error: 'Missing required fields: name, brokers, prometheusUrl' },
        { status: 400 }
      );
    }

    // Generate ID if not provided
    if (!body.id) {
      body.id = `cluster-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }

    const manager = getClusterManager();
    await manager.saveCluster(body);

    return NextResponse.json({ cluster: body }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating cluster:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create cluster' },
      { status: 500 }
    );
  }
}

