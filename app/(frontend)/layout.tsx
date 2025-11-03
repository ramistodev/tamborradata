import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Tamborradata',
  description: 'Statistics and information about the Tamborrada de San Sebastián',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="min-h-screen m-0 p-5 flex flex-col items-center justify-between">
        {children}
        <footer className="w-full text-center text-sm text-(--color-text-secondary) py-2 mt-8">
          <span>© {new Date().getFullYear()} Tamborradata. All rights reserved.</span>
        </footer>
      </body>
    </html>
  );
}
