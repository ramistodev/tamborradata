import { Header } from './components/Header/Header';

export function LayoutContent({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="relative w-full min-h-screen m-0 px-3 sm:px-5 flex flex-col items-center justify-between">
        {children}
      </main>
      <footer className="w-full text-center text-sm text-(--color-text-secondary) py-2 mt-8 mb-5 sm:mb-1">
        <span>&copy; {new Date().getFullYear()} Tamborradata - Todos los derechos reservados.</span>
      </footer>
    </>
  );
}
