'use client';
import Markdown from 'react-markdown';
import {
  CommonNameBySchool,
  LongestNames,
  MostConstantsSchools,
  NamesSurnamesDiversity,
  SchoolsEvolution,
  TopNames,
  TopSchools,
  TopSurnames,
  TotalParticipants,
} from './components';
import { GlobalProvider } from './context/GlobalProvider';
import { useGlobalContext } from './context/useGlobalContext';
import { LoadingPage } from '@/app/(frontend)/loaders/LoadingPage';
import { UpdatingPage } from '../components/UpdatingPage/UpdatingPage';
import { useGlobal } from './hooks/useGlobal';
import { InfoIcon } from '../../icons/icons';
import Link from 'next/dist/client/link';

export default function GlobalPage() {
  return (
    <GlobalProvider>
      <GlobalPageContent />
    </GlobalProvider>
  );
}

function GlobalPageContent() {
  const { statistics } = useGlobalContext();
  const { isLoading, isUpdating } = useGlobal();

  if (isUpdating) return <UpdatingPage />;

  if (isLoading || !statistics) return <LoadingPage />;

  return (
    <>
      <h1 className="text-2xl md:text-3xl font-bold">
        Tamborrada Infantil — Estadísticas Globales
      </h1>

      <div className="w-full text-sm sm:text-md md:text-base flex flex-col gap-3">
        <Markdown>{statistics?.intro[0]?.summary}</Markdown>
      </div>

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

      <div className="w-full text-sm sm:text-md md:text-base flex flex-col gap-3">
        <Markdown>{statistics?.outro[0]?.summary}</Markdown>
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
