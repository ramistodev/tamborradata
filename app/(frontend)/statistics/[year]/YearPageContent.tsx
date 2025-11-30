'use client';
import ReactMarkdown from 'react-markdown';
import rehypeSanitize from 'rehype-sanitize';
import Link from 'next/link';
import {
  NamesSurnamesDiversity,
  CommonNamesBySchool,
  TotalParticipants,
  TopSurnames,
  NewSchools,
  TopSchools,
  TopNames,
  NewNames,
} from './components';
import { notFound } from 'next/navigation';
import { InfoIcon } from '../../icons/icons';
import { UpdatingPage } from '../components/UpdatingPage';
import { LoadingPage } from '../components/loaders/LoadingPage';

import { useYears } from './hooks/useYears';

export function YearPageContent() {
  const { statistics, stats, isLoading, isFetching, isFetched, year } = useYears();

  if (statistics?.isUpdating) return <UpdatingPage />;

  if (isFetched && !isFetching && !statistics) return notFound();

  if (isLoading || !statistics) return <LoadingPage />;

  return (
    <article className="w-full flex flex-col gap-6" aria-labelledby="year-page-title">
      <h1 id="year-page-title" className="text-2xl md:text-3xl font-bold">
        <span className="hidden md:block">Estadísticas de la Tamborrada Infantil {year}</span>
        <span className="block md:hidden">Tamborrada Infantil {year}</span>
      </h1>

      <div className="w-full text-sm sm:text-md md:text-base flex flex-col gap-3">
        <ReactMarkdown rehypePlugins={[rehypeSanitize]}>{stats.intro[0]?.summary}</ReactMarkdown>
      </div>

      <hr className="w-full border border-(--color-border)" aria-hidden="true" />

      <TopNames />
      <TopSurnames />
      <NewNames />
      <NamesSurnamesDiversity />
      <TopSchools />
      <NewSchools />
      <CommonNamesBySchool />
      <TotalParticipants />

      <hr className="w-full border border-(--color-border)" aria-hidden="true" />

      <div className="w-full text-sm sm:text-md md:text-base flex flex-col gap-3">
        <ReactMarkdown rehypePlugins={[rehypeSanitize]}>{stats.outro[0]?.summary}</ReactMarkdown>
      </div>

      <Link
        href="./info"
        className="fixed w-12 h-12 rounded-full flex items-center justify-center bottom-5 right-5 lg:bottom-10 lg:right-10"
      >
        <InfoIcon />
      </Link>
    </article>
  );
}
