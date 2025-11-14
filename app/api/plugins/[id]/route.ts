import { NextRequest, NextResponse } from 'next/server';
import { getPluginRegistry } from '@/lib/plugins/registry';

// GET /api/plugins/[id] - Get plugin details
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const registry = getPluginRegistry();
    const plugin = registry.getPlugin(params.id);

    if (!plugin) {
      return NextResponse.json(
        { error: 'Plugin not found' },
        { status: 404 }
      );
    }

    const config = registry.getPluginConfig(params.id);

    return NextResponse.json({
      plugin: {
        manifest: plugin.manifest,
        config: config || { pluginId: params.id, enabled: true, config: {} },
      },
    });
  } catch (error: any) {
    console.error('Error fetching plugin:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch plugin' },
      { status: 500 }
    );
  }
}

// PUT /api/plugins/[id]/config - Update plugin configuration
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const registry = getPluginRegistry();

    const plugin = registry.getPlugin(params.id);
    if (!plugin) {
      return NextResponse.json(
        { error: 'Plugin not found' },
        { status: 404 }
      );
    }

    registry.configurePlugin(params.id, body);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error updating plugin config:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update plugin config' },
      { status: 500 }
    );
  }
}

// DELETE /api/plugins/[id] - Unregister plugin
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const registry = getPluginRegistry();
    registry.unregisterPlugin(params.id);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting plugin:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete plugin' },
      { status: 500 }
    );
  }
}

