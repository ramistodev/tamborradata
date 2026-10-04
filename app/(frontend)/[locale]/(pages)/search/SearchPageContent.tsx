'use client';
import { Hero } from './components/Hero/Hero';
import { SearchCard } from './components/SearchCard/SearchCard';
import { FAQs } from './components/FAQs/FAQs';

export function SearchPageContent() {
  return (
    <div className="relative flex flex-col items-center justify-center w-full h-full gap-4 pt-15 mt-10">
      {/* CONTENT */}
      <section className="w-full max-w-6xl mx-auto px-4 pb-16 flex flex-col items-center gap-12.5">
        <Hero />
        <SearchCard />
      </section>
      <FAQs />
    </div>
  );
}
