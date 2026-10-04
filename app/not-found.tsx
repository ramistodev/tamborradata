import './(frontend)/[locale]/globals.css';
import Link from 'next/link';

export default function GlobalNotFound() {
  return (
    <html lang="es">
      <body>
        <div className="w-full min-h-screen flex flex-col items-center justify-center gap-4 px-6 text-center">
          <h1 className="text-8xl font-extrabold">404</h1>
          <h2 className="text-2xl font-semibold">Página no encontrada</h2>
          <Link
            href="/"
            className="mt-4 inline-block px-8 py-3 rounded-full font-medium text-white bg-linear-to-r from-blue-600 to-blue-800 shadow-lg hover:shadow-xl transition-all"
          >
            Volver al inicio
          </Link>
        </div>
      </body>
    </html>
  );
}
