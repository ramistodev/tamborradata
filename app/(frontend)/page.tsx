import { Metadata } from 'next';
import { HomeStructuredData } from './HomeStructuredData';
import { Intro } from './components/Intro/Intro';
import { SearchParticipant } from './components/SearchParticipant/SearchParticipant';
import { ExploreStatistics } from './components/ExploreStatistics/ExploreStatistics';
import { NextSteps } from './components/NextSteps/NextSteps';
import { OpenSource } from './components/OpenSource/OpenSource';
import { Contact } from './components/Contact/Contact';
import { FAQs } from './components/FAQs/FAQs';

export const metadata: Metadata = {
  title: 'Tamborradata · Datos y Estadísticas',
  description:
    'Datos oficiales de la Tamborrada Infantil desde 2018: participación, nombres más comunes, colegios y tendencias culturales de Donostia.',
  alternates: {
    canonical: 'https://tamborradata.com',
  },
};

export default function Home() {
  return (
    <>
      <HomeStructuredData />

      <main className="flex flex-col items-center justify-center w-full h-full gap-4">
        <Intro />
        <SearchParticipant />
        <ExploreStatistics />
        <NextSteps />
        <OpenSource />
        <Contact />
        <FAQs />
      </main>
    </>
  );
}
