// next.config.mjs
import withPWA from 'next-pwa';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,      // Enable React strict mode for improved error handling
  // swcMinify: true,         // Removed as it's unrecognized or no longer needed
  compiler: {
    removeConsole: process.env.NODE_ENV !== "development"  // Remove console.log in production
  },
  
  // Add allowed dev origins to fix cross-origin warning
  allowedDevOrigins: [
    'wks-ti004.5stransportes.com.br',
    // Add any other origins you need to allow
  ],
  
  // Moved from experimental.turbo to top-level turbopack configuration
  turbopack: {
    loaders: {
      // Changed string values to arrays for each file type
      '.png': ['file'],
      '.svg': ['file'],
      '.jpg': ['file'],
      '.jpeg': ['file'],
      '.gif': ['file'],
      '.webp': ['file'],
      '.woff': ['file'],
      '.woff2': ['file']
    },
    // Configure any needed resolvers for Turbopack
    resolveExtensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
    rules: {
      // Add any needed custom rules for Turbopack
    }
  }
};

// Apply PWA configuration
export default withPWA({
  dest: "public",               // destination directory for the PWA files
  disable: process.env.NODE_ENV === "development",  // disable PWA in development (fixed logical operator)
  register: true,               // register the PWA service worker
  skipWaiting: true,            // skip waiting for service worker activation
})(nextConfig);