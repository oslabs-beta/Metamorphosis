import { Plugin, PluginManifest, PluginConfig } from '@/types/plugin';
import { loadPlugin } from './loader';

class PluginRegistry {
  private plugins: Map<string, Plugin> = new Map();
  private configs: Map<string, PluginConfig> = new Map();

  /**
   * Register a plugin
   */
  async registerPlugin(manifestPath: string): Promise<void> {
    try {
      const plugin = await loadPlugin(manifestPath);
      this.plugins.set(plugin.manifest.id, plugin);
      console.log(`Plugin registered: ${plugin.manifest.name} v${plugin.manifest.version}`);
    } catch (error) {
      console.error(`Failed to register plugin from ${manifestPath}:`, error);
      throw error;
    }
  }

  /**
   * Unregister a plugin
   */
  unregisterPlugin(pluginId: string): void {
    this.plugins.delete(pluginId);
    this.configs.delete(pluginId);
  }

  /**
   * Get a plugin by ID
   */
  getPlugin(pluginId: string): Plugin | undefined {
    return this.plugins.get(pluginId);
  }

  /**
   * Get all registered plugins
   */
  getAllPlugins(): Plugin[] {
    return Array.from(this.plugins.values());
  }

  /**
   * Get enabled plugins
   */
  getEnabledPlugins(): Plugin[] {
    return this.getAllPlugins().filter((plugin) => {
      const config = this.configs.get(plugin.manifest.id);
      return config?.enabled !== false;
    });
  }

  /**
   * Configure a plugin
   */
  configurePlugin(pluginId: string, config: Partial<PluginConfig>): void {
    const existing = this.configs.get(pluginId);
    this.configs.set(pluginId, {
      pluginId,
      enabled: config.enabled !== undefined ? config.enabled : existing?.enabled ?? true,
      config: { ...existing?.config, ...config.config },
    });
  }

  /**
   * Get plugin configuration
   */
  getPluginConfig(pluginId: string): PluginConfig | undefined {
    return this.configs.get(pluginId);
  }

  /**
   * Load all plugins from a directory
   */
  async loadPluginsFromDirectory(directory: string): Promise<void> {
    // This would scan the directory for plugin manifests
    // For now, it's a placeholder
    console.log(`Loading plugins from ${directory}`);
  }
}

// Singleton instance
let pluginRegistryInstance: PluginRegistry | null = null;

export function getPluginRegistry(): PluginRegistry {
  if (!pluginRegistryInstance) {
    pluginRegistryInstance = new PluginRegistry();
  }
  return pluginRegistryInstance;
}

