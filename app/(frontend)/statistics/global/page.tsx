'use client';
import Markdown from 'react-markdown';
import { CommonNameBySchool } from './components/CommonNameBySchool/CommonNameBySchool';
import { LongestNames } from './components/LongestNames/LongestNames';
import { MostConstantsSchools } from './components/MostConstantsSchools/MostConstantsSchools';
import { NamesSurnamesDiversity } from './components/NameSurnameDiversity/NameSurnameDiversity';
import { SchoolsEvolution } from './components/SchoolsEvolution/SchoolsEvolution';
import { TopNames } from './components/TopNames/TopNames';
import { TopSchools } from './components/TopSchools/TopSchools';
import { TopSurnames } from './components/TopSurnames/TopSurnames';
import { TotalParticipants } from './components/TotalParticipants/TotalParticipants';
import { GlobalProvider } from './context/GlobalProvider';
import { useGlobalContext } from './context/useGlobalContext';
import { useGlobal } from './hooks/useGlobal';
import { LoadingPage } from '@/app/(frontend)/loaders/LoadingPage';

export default function GlobalPage() {
  return (
    <GlobalProvider>
      <GlobalPageContent />
    </GlobalProvider>
  );
}

function GlobalPageContent() {
  const { statistics } = useGlobalContext();
  const { isLoading } = useGlobal();

  if (isLoading || !statistics) {
    return <LoadingPage />;
  }

  return (
    <main className="w-full max-w-6xl flex flex-col items-start justify-start gap-6 p-4 sm:px-15 md:px-30 rounded-2xl border border-(--color-border)">
      <h1 className="text-3xl font-bold">Tamborrada Infantil — Estadísticas Globales</h1>
      <Markdown>{statistics.intro[0].summary}</Markdown>
      <span className="w-full border border-(--color-border)"></span>
      <TopNames />
      <TopSurnames />
      <NamesSurnamesDiversity />
      <LongestNames />
      <TopSchools />
      <MostConstantsSchools />
      <SchoolsEvolution />
      <CommonNameBySchool />
      <TotalParticipants />
      <span className="w-full border border-(--color-border)"></span>
      <Markdown>{statistics.outro[0].summary}</Markdown>
    </main>
  );
}
