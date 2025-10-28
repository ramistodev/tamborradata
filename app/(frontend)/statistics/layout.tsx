'use client';
import { Header } from './components/Header/Header';

export default function StatsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="flex flex-col items-center justify-start w-full py-3 mt-16">{children}</main>
    </>
  );
}
