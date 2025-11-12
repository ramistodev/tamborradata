'use client';
import Markdown from 'react-markdown';
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
import { YearProvider } from './context/YearProvider';
import { useYearContext } from './context/useYearContext';
import { LoadingPage } from '../../loaders/LoadingPage';
import { UpdatingPage } from '../components/UpdatingPage/UpdatingPage';
import { useYear } from './hooks/useYear';
import { InfoIcon } from '../../icons/icons';
import { notFound } from 'next/navigation';
import Link from 'next/link';

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

  if (isUpdating) return <UpdatingPage />;

  if (!statistics && !isLoading) return notFound();

  if (isLoading || !statistics) return <LoadingPage />;

  return (
    <>
      <h1 className="text-2xl md:text-3xl font-bold">Tamborrada Infantil {year}</h1>

      <div className="w-full text-sm sm:text-md md:text-base flex flex-col gap-3">
        <Markdown>{statistics.intro[0]?.summary}</Markdown>
      </div>

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

      <div className="w-full text-sm sm:text-md md:text-base flex flex-col gap-3">
        <Markdown>{statistics.outro[0]?.summary}</Markdown>
      </div>

      <Link
        href="./info"
        className="fixed w-12 h-12 rounded-full flex items-center justify-center bottom-5 right-5 lg:bottom-10 lg:right-10"
      >
        <InfoIcon />
      </Link>
    </>
  );
}
