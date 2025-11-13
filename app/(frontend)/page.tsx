import { ExploreStatistics } from './components/ExploreStatistics/ExploreStatistics';
import { FAQs } from './components/FAQs/FAQs';
import { Intro } from './components/Intro/Intro';

// Pagina principal del frontend
export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center w-full h-full">
      <Intro />
      <ExploreStatistics />
      <FAQs />
    </main>
  );
}
