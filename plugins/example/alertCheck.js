/**
 * Example Alert Check
 * 
 * Custom alert logic for specific conditions
 */

module.exports = {
  evaluate: (metrics, config) => {
    // Example: Check if a custom metric exceeds threshold
    const customMetric = metrics['custom_metric_1'];
    const threshold = config.threshold || 50;
    
    if (customMetric && customMetric.value > threshold) {
      return {
        fired: true,
        message: `Custom metric exceeded threshold: ${customMetric.value} > ${threshold}`,
        severity: 'high'
      };
    }
    
    return {
      fired: false,
      message: 'All metrics within normal range',
      severity: 'low'
    };
  }
};

