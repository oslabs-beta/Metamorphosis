/**
 * Example Metric Transformer
 * 
 * Transforms metric data before display
 */

module.exports = {
  transform: (data, config) => {
    // Example: Convert bytes to MB
    if (config && config.convertToMB) {
      if (typeof data === 'number') {
        return data / (1024 * 1024);
      }
      if (data && typeof data.value === 'number') {
        return {
          ...data,
          value: data.value / (1024 * 1024),
          unit: 'MB'
        };
      }
    }
    
    return data;
  }
};

