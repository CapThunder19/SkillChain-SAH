import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: false,
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
  // Next.js 16 defaults to Turbopack — must also provide turbopack config when using webpack
  turbopack: {
    resolveAlias: {
      // Provide browser-safe no-op aliases for Node.js built-ins used by Solana packages
      fs: { browser: './node_modules/browserify-fs' },
      os: { browser: 'os-browserify/browser' },
      path: { browser: 'path-browserify' },
      crypto: { browser: 'crypto-browserify' },
    },
  },
  images: {
    unoptimized: true,
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
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
