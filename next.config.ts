import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  serverExternalPackages: [
    '@prisma/client',
    '@prisma/adapter-pg',
    'pg',
    'pg-pool',
    'pg-connection-string',
  ],

  async redirects() {
    return [
      {
        source: '/',
        destination: '/signature?state=signature',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
