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
        className="flex-1 relative w-full flex flex-col items-center justify-between focus:outline-none"
      >
        {children}
      </main>
      <Footer />
    </>
  );
}
