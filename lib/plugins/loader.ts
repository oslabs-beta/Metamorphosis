import { Plugin, PluginManifest } from '@/types/plugin';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Load a plugin from its manifest file
 */
export async function loadPlugin(manifestPath: string): Promise<Plugin> {
  // Read and parse manifest
  const manifestContent = fs.readFileSync(manifestPath, 'utf-8');
  const manifest: PluginManifest = JSON.parse(manifestContent);

  // Validate manifest
  validateManifest(manifest);

  // Load plugin module
  const pluginDir = path.dirname(manifestPath);
  const entryPoint = path.resolve(pluginDir, manifest.entryPoint);
  
  // Dynamic import would be used here in production
  // For now, we'll use require for Node.js compatibility
  const pluginModule = require(entryPoint);

  const plugin: Plugin = {
    manifest,
  };

  // Load hooks if they exist
  if (manifest.hooks?.metricFetcher) {
    const fetcherPath = path.resolve(pluginDir, manifest.hooks.metricFetcher);
    plugin.metricFetcher = require(fetcherPath);
  }

  if (manifest.hooks?.transformer) {
    const transformerPath = path.resolve(pluginDir, manifest.hooks.transformer);
    plugin.transformer = require(transformerPath);
  }

  if (manifest.hooks?.uiWidget) {
    const widgetPath = path.resolve(pluginDir, manifest.hooks.uiWidget);
    plugin.uiWidget = require(widgetPath);
  }

  if (manifest.hooks?.alertCheck) {
    const checkPath = path.resolve(pluginDir, manifest.hooks.alertCheck);
    plugin.alertCheck = require(checkPath);
  }

  return plugin;
}

/**
 * Validate plugin manifest
 */
function validateManifest(manifest: PluginManifest): void {
  const required = ['id', 'name', 'version', 'description', 'author', 'entryPoint'];
  
  for (const field of required) {
    if (!manifest[field as keyof PluginManifest]) {
      throw new Error(`Plugin manifest missing required field: ${field}`);
    }
  }

  // Validate version format (semver)
  const semverRegex = /^\d+\.\d+\.\d+$/;
  if (!semverRegex.test(manifest.version)) {
    throw new Error(`Invalid version format: ${manifest.version}`);
  }
}

/**
 * Discover plugins in a directory
 */
export function discoverPlugins(pluginDirectory: string): string[] {
  const manifests: string[] = [];

  if (!fs.existsSync(pluginDirectory)) {
    return manifests;
  }

  const entries = fs.readdirSync(pluginDirectory, { withFileTypes: true });

  for (const entry of entries) {
    if (entry.isDirectory()) {
      const manifestPath = path.join(pluginDirectory, entry.name, 'plugin.json');
      if (fs.existsSync(manifestPath)) {
        manifests.push(manifestPath);
      }
    }
  }

  return manifests;
}

