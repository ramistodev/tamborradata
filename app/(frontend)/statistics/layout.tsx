'use client';
import { Header } from './components/Header/Header';

export default function StatsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="flex flex-col items-center justify-start w-full py-3 mt-16">
        <main className="w-full max-w-6xl flex flex-col items-start justify-start gap-6 p-4 sm:px-15 md:px-30 rounded-2xl border border-(--color-border)">
          {children}
        </main>
      </main>
    </>
  );
}
