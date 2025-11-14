/**
 * Example Metric Fetcher
 * 
 * Fetches custom metrics from external sources
 */

module.exports = {
  fetchMetrics: async (config) => {
    // Example: Fetch custom metrics
    // In a real plugin, this would connect to an external API, database, etc.
    
    return {
      'custom_metric_1': {
        value: 42,
        timestamp: Date.now(),
        labels: { source: 'example-plugin' }
      },
      'custom_metric_2': {
        value: 100,
        timestamp: Date.now(),
        labels: { source: 'example-plugin' }
      }
    };
  }
};

