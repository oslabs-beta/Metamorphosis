import { NextRequest, NextResponse } from 'next/server';
import { getClusterManager } from '@/lib/clusters/manager';
import { KafkaCluster } from '@/types';

// GET /api/clusters/[id] - Get a specific cluster
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const manager = getClusterManager();
    const cluster = await manager.getCluster(params.id);

    if (!cluster) {
      return NextResponse.json(
        { error: 'Cluster not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ cluster });
  } catch (error: any) {
    console.error('Error fetching cluster:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch cluster' },
      { status: 500 }
    );
  }
}

// PUT /api/clusters/[id] - Update a cluster
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body: Partial<KafkaCluster> = await request.json();
    const manager = getClusterManager();

    const existingCluster = await manager.getCluster(params.id);
    if (!existingCluster) {
      return NextResponse.json(
        { error: 'Cluster not found' },
        { status: 404 }
      );
    }

    const updatedCluster: KafkaCluster = {
      ...existingCluster,
      ...body,
      id: params.id,
    };

    await manager.saveCluster(updatedCluster);

    return NextResponse.json({ cluster: updatedCluster });
  } catch (error: any) {
    console.error('Error updating cluster:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update cluster' },
      { status: 500 }
    );
  }
}

// DELETE /api/clusters/[id] - Delete a cluster
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const manager = getClusterManager();
    await manager.deleteCluster(params.id);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting cluster:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete cluster' },
      { status: 500 }
    );
  }
}

