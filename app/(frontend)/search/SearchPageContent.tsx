'use client';
import { Hero } from './components/Hero/Hero';
import { SearchCard } from './components/SearchCard/SearchCard';

export function SearchPageContent() {
  return (
    <main className="flex flex-col items-center justify-center w-full h-full gap-4">
      <Hero />
      <SearchCard />
    </main>
  );
}
