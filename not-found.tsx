export default function NotFound() {
  return (
    <main className="w-full h-screen flex flex-col items-center justify-center gap-8 px-4 bg-white dark:bg-gray-900">
      {/* Card container */}
      <div className="p-8 rounded-lg border border-gray-200 dark:border-gray-700 max-w-md w-full text-center space-y-6 bg-gray-50 dark:bg-gray-800">
        {/* 404 Number */}
        <div className="space-y-2">
          <h1 className="text-6xl font-bold text-blue-600 dark:text-blue-400">404</h1>
          <div className="w-16 h-1 mx-auto rounded bg-blue-600 dark:bg-blue-400"></div>
        </div>

        {/* Error message */}
        <div className="space-y-3">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Página no encontrada
          </h2>
          <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
            La página que buscas no existe o ha sido movida.
          </p>
        </div>
      </div>
    </main>
  );
}
