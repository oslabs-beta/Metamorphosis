/**
 * Plugin Interface for Metamorphosis
 * 
 * Plugins allow users to extend the observability platform with custom
 * metric fetchers, transformers, UI widgets, and alert checks.
 */

export interface PluginManifest {
  id: string;
  name: string;
  version: string;
  description: string;
  author: string;
  entryPoint: string;
  hooks?: {
    metricFetcher?: string;
    transformer?: string;
    uiWidget?: string;
    alertCheck?: string;
  };
  permissions?: string[];
}

export interface MetricFetcher {
  /**
   * Fetch custom metrics from external sources
   */
  fetchMetrics(config: Record<string, any>): Promise<Record<string, any>>;
}

export interface MetricTransformer {
  /**
   * Transform metric data before display
   */
  transform(data: any, config?: Record<string, any>): any;
}

export interface UIWidget {
  /**
   * Render a custom UI component
   */
  render(props: Record<string, any>): React.ReactElement;
}

export interface AlertCheck {
  /**
   * Custom alert check logic
   */
  evaluate(metrics: Record<string, any>, config: Record<string, any>): {
    fired: boolean;
    message: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
  };
}

export interface Plugin {
  manifest: PluginManifest;
  metricFetcher?: MetricFetcher;
  transformer?: MetricTransformer;
  uiWidget?: UIWidget;
  alertCheck?: AlertCheck;
}

export interface PluginConfig {
  pluginId: string;
  enabled: boolean;
  config: Record<string, any>;
}

