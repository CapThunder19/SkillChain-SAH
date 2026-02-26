import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: false,
  turbopack: {},
  images: {
    // Allow unoptimized images (needed for SVG img tags and our API route)
    unoptimized: true,
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  // Allow SVG in img tags
  async headers() {
    return [
      {
        source: '/api/nft-image/:path*',
        headers: [
          { key: 'Content-Type', value: 'image/svg+xml' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Cache-Control', value: 'public, max-age=86400' },
        ],
      },
    ];
  },
};

export default nextConfig;
