'use client';
import Markdown from 'react-markdown';
import { notFound } from 'next/navigation';
import { LoadingPage } from '../../loaders/LoadingPage';
import { useYearContext } from './context/useYearContext';
import { YearProvider } from './context/YearProvider';
import { useYear } from './hooks/useYear';
import { InfoIcon } from '../../icons/icons';
import Link from 'next/link';
import {
  TopNames,
  TopSurnames,
  TopSchools,
  TotalParticipants,
  NewSchools,
  NewNames,
  CommonNamesBySchool,
  NamesSurnamesDiversity,
} from './components';

export default function YearPage() {
  return (
    <YearProvider>
      <YearPageContent />
    </YearProvider>
  );
}

function YearPageContent() {
  const { statistics } = useYearContext();
  const { year, isLoading, isUpdating } = useYear();

  if (isUpdating) {
    return (
      <div className="w-full min-h-screen flex flex-col items-center justify-center px-4 py-16">
        <h2 className="text-xl font-bold">Updating...</h2>
      </div>
    );
  }

  if (!statistics && !isLoading) return notFound();

  if (isLoading || !statistics) return <LoadingPage />;

  return (
    <>
      <h1 className="text-3xl font-bold">Tamborrada Infantil — {year}</h1>

      <Markdown>{statistics.intro[0]?.summary}</Markdown>

      <span className="w-full border border-(--color-border)"></span>

      <TopNames />
      <TopSurnames />
      <NewNames />
      <NamesSurnamesDiversity />
      <TopSchools />
      <NewSchools />
      <CommonNamesBySchool />
      <TotalParticipants />

      <span className="w-full border border-(--color-border)"></span>

      <Markdown>{statistics.outro[0]?.summary}</Markdown>

      <Link
        href="./info"
        className="fixed w-12 h-12 rounded-full flex items-center justify-center bottom-5 right-5 lg:bottom-10 lg:right-10"
      >
        <InfoIcon />
      </Link>
    </>
  );
}
