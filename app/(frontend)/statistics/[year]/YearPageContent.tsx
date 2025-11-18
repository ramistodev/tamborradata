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
import { InfoIcon } from '../../icons/icons';
import { LoadingPage } from '../../loaders/LoadingPage';
import { notFound } from 'next/navigation';
import { UpdatingPage } from '../components/UpdatingPage/UpdatingPage';
import { useYear } from './hooks/useYear';
import { useYearContext } from './context/useYearContext';

export function YearPageContent() {
  const { statistics } = useYearContext();
  const { year, isLoading, isUpdating } = useYear();

  if (isUpdating) return <UpdatingPage />;

  if (!statistics && !isLoading) return notFound();

  if (isLoading || !statistics) return <LoadingPage />;

  return (
    <>
      <h1 className="text-2xl md:text-3xl font-bold">Tamborrada Infantil {year}</h1>

      <div className="w-full text-sm sm:text-md md:text-base flex flex-col gap-3">
        <ReactMarkdown rehypePlugins={[rehypeSanitize]}>
          {statistics.intro[0]?.summary}
        </ReactMarkdown>
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
        <ReactMarkdown rehypePlugins={[rehypeSanitize]}>
          {statistics.outro[0]?.summary}
        </ReactMarkdown>
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
