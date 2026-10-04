import { Header } from './components/Header/Header';
import { Footer } from './components/Footer';

export function LayoutContent({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      {/* id + tabIndex: target of the "skip to content" link */}
      <main
        id="main-content"
        tabIndex={-1}
        className="relative w-full flex-1 m-0 px-3 sm:px-5 flex flex-col items-center justify-between focus:outline-none"
      >
        {children}
      </main>
      <Footer />
    </>
  );
}
