import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Tamborrada Stats',
  description: 'Statistics and information about the Tamborrada de San Sebastián',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="h-screen m-0 p-5 flex flex-col items-center justify-between">
        {children}
      </body>
    </html>
  );
}
