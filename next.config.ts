import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  async redirects() {
    const redirects = [];

    // Solo hacer redirecciones en producción
    if (process.env.NODE_ENV === 'production') {
      redirects.push(
        // Redirigir www a dominio principal
        {
          source: '/(.*)',
          has: [
            {
              type: 'host' as const,
              value: 'www.tamborradata.com',
            },
          ],
          destination: 'https://tamborradata.com/$1',
          permanent: true,
        },
        // Redirigir Vercel URL a dominio principal
        {
          source: '/(.*)',
          has: [
            {
              type: 'host' as const,
              value: 'tamborradata.vercel.app',
            },
          ],
          destination: 'https://tamborradata.com/$1',
          permanent: true,
        }
      );
    }

    return redirects;
  },

  // Otras configuraciones
  poweredByHeader: false,
  compress: true,

  // Headers de seguridad
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
