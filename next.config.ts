/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    domains: ["images.unsplash.com"],
  },
  // Using any type here since we're ignoring build errors and webpack types may not be available
  webpack: (config: any, { isServer }: { isServer: boolean }) => {
    // Handle PDF.js and canvas dependencies
    if (!isServer) {
      // Only apply these settings for client-side webpack bundles
      config.resolve = config.resolve || {};
      config.resolve.alias = config.resolve.alias || {};
      config.resolve.alias.canvas = false;
      config.resolve.alias.encoding = false;

      // Explicitly mark pdfjs worker as external
      config.externals = [
        ...(config.externals || []),
        { "pdfjs-dist/build/pdf.worker.js": "pdf.worker.js" },
      ];
    }

    return config;
  },
  // Transpile necessary packages
  transpilePackages: ["react-pdf", "pdfjs-dist"],
  experimental: {
    optimizePackageImports: ["framer-motion"],
  },
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
};

module.exports = nextConfig;
