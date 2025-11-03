import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Tamborradata',
  description: 'Análisis de la Tamborrada Infantil de San Sebastián',

  // Favicon (navegador)
  icons: {
    icon: [{ url: '/assets/logo-big.webp', sizes: '16x16', type: 'image/webp' }],
    apple: [{ url: '/assets/logo-big.webp', sizes: '16x16', type: 'image/webp' }],
    shortcut: '/assets/logo-big.webp',
  },

  // Open Graph (Facebook, WhatsApp, LinkedIn)
  openGraph: {
    title: 'Tamborradata',
    description: 'Análisis de la Tamborrada Infantil de San Sebastián',
    url: 'https://tamborradata.com',
    siteName: 'Tamborradata',
    images: [
      {
        url: '/assets/logo-big.webp', // ← Este se mostrará al compartir
        width: 1200,
        height: 630,
        alt: 'Tamborradata - Análisis de la Tamborrada Infantil',
      },
    ],
    locale: 'es_ES',
    type: 'website',
  },

  // Twitter Card
  twitter: {
    card: 'summary_large_image',
    title: 'Tamborradata',
    description: 'Análisis de la Tamborrada Infantil de San Sebastián',
    images: ['/assets/logo-big.webp'], // ← También para Twitter
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="min-h-screen m-0 px-5 flex flex-col items-center justify-between">
        {children}
        <footer className="w-full text-center text-sm text-(--color-text-secondary) py-2 mt-8">
          <span>© {new Date().getFullYear()} Tamborradata · Todos los derechos reservados.</span>
        </footer>
      </body>
    </html>
  );
}
