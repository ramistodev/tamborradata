import { Header, Footer } from './components';

export function LayoutContent({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="relative w-full flex-1 m-0 px-3 sm:px-5 flex flex-col items-center justify-between">
        {children}
      </main>
      <Footer />
    </>
  );
}
