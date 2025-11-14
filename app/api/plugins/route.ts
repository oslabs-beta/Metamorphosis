import { NextRequest, NextResponse } from 'next/server';
import { getPluginRegistry } from '@/lib/plugins/registry';

// GET /api/plugins - List all plugins
export async function GET() {
  try {
    const registry = getPluginRegistry();
    const plugins = registry.getAllPlugins();
    
    return NextResponse.json({
      plugins: plugins.map((plugin) => ({
        id: plugin.manifest.id,
        name: plugin.manifest.name,
        version: plugin.manifest.version,
        description: plugin.manifest.description,
        author: plugin.manifest.author,
        enabled: registry.getPluginConfig(plugin.manifest.id)?.enabled ?? true,
      })),
    });
  } catch (error: any) {
    console.error('Error fetching plugins:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch plugins' },
      { status: 500 }
    );
  }
}

// POST /api/plugins - Register a new plugin
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { manifestPath } = body;

    if (!manifestPath) {
      return NextResponse.json(
        { error: 'manifestPath is required' },
        { status: 400 }
      );
    }

    const registry = getPluginRegistry();
    await registry.registerPlugin(manifestPath);

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error: any) {
    console.error('Error registering plugin:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to register plugin' },
      { status: 500 }
    );
  }
}

