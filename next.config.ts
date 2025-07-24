import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/signature?state=signature',
        permanent: false,
      },
    ]
  },
}

export default nextConfig
