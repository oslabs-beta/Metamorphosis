/**
 * Example Plugin for Metamorphosis
 * 
 * This demonstrates how to create a custom plugin that extends
 * the observability platform with custom functionality.
 */

module.exports = {
  name: 'Example Plugin',
  version: '1.0.0',
  
  // Plugin initialization
  initialize: async (config) => {
    console.log('Example plugin initialized with config:', config);
    return { success: true };
  },
  
  // Plugin cleanup
  cleanup: async () => {
    console.log('Example plugin cleanup');
  },
};

