import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  webpack: (config) => {
    // Handle JSON files
    config.resolve.extensions.push('.json');
    return config;
  },
};

export default nextConfig;
