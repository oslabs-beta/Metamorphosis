# Metamorphosis Plugin System

The Metamorphosis plugin system allows you to extend the observability platform with custom functionality.

## Plugin Structure

A plugin is a directory containing:

```
plugin-name/
├── plugin.json          # Plugin manifest (required)
├── index.js            # Main entry point (required)
├── metricFetcher.js    # Optional: Custom metric fetcher
├── transformer.js      # Optional: Metric data transformer
├── uiWidget.js         # Optional: Custom UI component
└── alertCheck.js       # Optional: Custom alert logic
```

## Plugin Manifest (plugin.json)

```json
{
  "id": "my-plugin",
  "name": "My Custom Plugin",
  "version": "1.0.0",
  "description": "Description of what this plugin does",
  "author": "Your Name",
  "entryPoint": "index.js",
  "hooks": {
    "metricFetcher": "metricFetcher.js",
    "transformer": "transformer.js",
    "alertCheck": "alertCheck.js"
  },
  "permissions": [
    "read_metrics",
    "write_alerts"
  ]
}
```

## Plugin Hooks

### Metric Fetcher

Fetches custom metrics from external sources:

```javascript
module.exports = {
  fetchMetrics: async (config) => {
    // Fetch metrics from external API, database, etc.
    return {
      'custom_metric': {
        value: 100,
        timestamp: Date.now(),
        labels: { source: 'my-plugin' }
      }
    };
  }
};
```

### Transformer

Transforms metric data before display:

```javascript
module.exports = {
  transform: (data, config) => {
    // Transform data (e.g., convert units, aggregate)
    return transformedData;
  }
};
```

### Alert Check

Custom alert evaluation logic:

```javascript
module.exports = {
  evaluate: (metrics, config) => {
    // Evaluate custom alert conditions
    return {
      fired: true,
      message: 'Alert message',
      severity: 'high'
    };
  }
};
```

## Loading Plugins

### Via API

```bash
POST /api/plugins
{
  "manifestPath": "/path/to/plugin/plugin.json"
}
```

### Programmatically

```typescript
import { getPluginRegistry } from '@/lib/plugins/registry';

const registry = getPluginRegistry();
await registry.registerPlugin('/path/to/plugin/plugin.json');
```

## Plugin Configuration

Configure plugins via the API:

```bash
PUT /api/plugins/{pluginId}/config
{
  "enabled": true,
  "config": {
    "customSetting": "value"
  }
}
```

## Example Plugin

See `plugins/example/` for a complete example plugin demonstrating all hooks.

## Best Practices

1. **Versioning**: Use semantic versioning (e.g., 1.0.0)
2. **Error Handling**: Always handle errors gracefully
3. **Performance**: Keep metric fetchers efficient
4. **Security**: Validate all inputs and configurations
5. **Documentation**: Document your plugin's purpose and usage

## Permissions

Plugins can request permissions:
- `read_metrics`: Read metric data
- `write_alerts`: Create/modify alerts
- `read_config`: Read configuration
- `write_config`: Modify configuration

## Plugin Discovery

Plugins can be discovered automatically by placing them in the `plugins/` directory with a `plugin.json` manifest file.

