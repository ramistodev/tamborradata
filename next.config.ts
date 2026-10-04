import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./app/(frontend)/i18n/request.ts');

const nextConfig: NextConfig = {
  // Dev only: lets a phone on the same Wi-Fi (http://192.168.x.x:3000) load and hydrate the app.
  // Next 16 blocks cross-origin dev requests by default, which leaves every button dead.
  allowedDevOrigins: ['192.168.*.*'],

  async redirects() {
    const redirects = [];

    // Solo en producción
    if (process.env.NODE_ENV === 'production') {
      redirects.push(
        // Forzar dominio sin www
        {
          source: '/:path*',
          has: [
            {
              type: 'host' as const,
              value: 'www.tamborradata.com',
            },
          ],
          destination: 'https://tamborradata.com/:path*',
          permanent: true,
        }
      );
    }

    return redirects;
  },

  // ⚡ Seguridad y rendimiento
  poweredByHeader: false,
  compress: true,

  // 🔒 Headers de seguridad
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'origin-when-cross-origin' },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
        ],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
