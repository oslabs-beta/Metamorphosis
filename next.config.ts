import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: 'standalone', // For Docker deployment
  images: {
    domains: [],
  },
  // Enable experimental features for App Router
  experimental: {
    serverActions: true,
  },
  // Transpile packages that may not be compatible with Next.js
  transpilePackages: ['@mui/material', '@mui/icons-material'],
  // Webpack configuration for existing dependencies
  webpack: (config, { isServer }) => {
    // Handle SCSS imports
    config.module.rules.push({
      test: /\.scss$/,
      use: ['style-loader', 'css-loader', 'sass-loader'],
    });
    
    // Handle socket.io-client on server
    if (isServer) {
      config.externals.push('socket.io-client');
    }
    
    return config;
  },
  // Environment variables
  env: {
    LOCALMODE: process.env.LOCALMODE,
    REACT_APP_AUTH0_DOMAIN: process.env.REACT_APP_AUTH0_DOMAIN,
    REACT_APP_AUTH0_CLIENTID: process.env.REACT_APP_AUTH0_CLIENTID,
  },
};

export default nextConfig;

