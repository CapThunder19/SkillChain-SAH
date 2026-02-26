import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: false,
  turbopack: {},
  // Force Next.js to transpile Solana wallet ESM-only packages
  transpilePackages: [
    '@solana/wallet-adapter-base',
    '@solana/wallet-adapter-react',
    '@solana/wallet-adapter-react-ui',
    '@solana/wallet-adapter-phantom',
    '@solana/wallet-adapter-solflare',
    '@solana/wallet-standard-wallet-adapter-base',
    '@solana/wallet-standard-wallet-adapter-react',
    '@solana/wallet-standard',
    '@wallet-standard/app',
    '@wallet-standard/base',
    '@wallet-standard/features',
    '@wallet-standard/wallet',
  ],
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
