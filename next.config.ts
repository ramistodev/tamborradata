import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/(.*)',
        destination: 'https://tamborradata.com/$1',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
