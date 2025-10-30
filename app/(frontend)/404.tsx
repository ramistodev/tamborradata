'use client';

import { useRouter } from 'next/navigation';

export function NotFound() {
  const router = useRouter();

  return (
    <main
      className="w-full h-screen flex flex-col items-center justify-center gap-8 px-4"
      style={{ background: 'var(--color-bg)' }}
    >
      {/* Card container */}
      <div
        className="p-8 rounded-lg border max-w-md w-full text-center space-y-6"
        style={{
          background: 'var(--color-bg-secondary)',
          borderColor: 'var(--color-border)',
        }}
      >
        {/* 404 Number */}
        <div className="space-y-2">
          <h1 className="text-6xl font-bold" style={{ color: 'var(--color-primary)' }}>
            404
          </h1>
          <div
            className="w-16 h-1 mx-auto rounded"
            style={{ background: 'var(--color-primary)' }}
          ></div>
        </div>

        {/* Error message */}
        <div className="space-y-3">
          <h2 className="text-xl font-semibold" style={{ color: 'var(--color-text)' }}>
            Página no encontrada
          </h2>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
            La página que buscas no existe o ha sido movida.
          </p>
        </div>

        {/* Action buttons */}
        <div className="space-y-3 pt-2">
          <button
            onClick={() => router.push('/')}
            className="w-full py-3 px-4 rounded font-medium transition-opacity hover:opacity-80"
            style={{
              background: 'var(--color-primary)',
              color: 'white',
            }}
          >
            Volver al inicio
          </button>

          <button
            onClick={() => router.back()}
            className="w-full py-2 px-4 rounded text-sm transition-opacity hover:opacity-80"
            style={{
              color: 'var(--color-text-thirdary)',
              background: 'transparent',
            }}
          >
            ← Página anterior
          </button>
        </div>
      </div>
    </main>
  );
}
