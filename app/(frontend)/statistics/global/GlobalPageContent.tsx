'use client';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import rehypeSanitize from 'rehype-sanitize';
import { InfoIcon } from '../../icons/icons';
import { useGlobal } from './hooks/useGlobal';
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

export function GlobalPageContent() {
  const { stats } = useGlobal();

  return (
    <article className="w-full flex flex-col gap-6" aria-labelledby="global-page-title">
      <h1 id="global-page-title" className="text-2xl md:text-3xl font-bold">
        <span className="hidden md:block">Estadísticas globales de la Tamborrada Infantil</span>
        <span className="block md:hidden">Estadísticas Globales</span>
      </h1>

      <div className="w-full text-sm sm:text-md md:text-base flex flex-col gap-3">
        <ReactMarkdown rehypePlugins={[rehypeSanitize]}>{stats?.intro[0]?.summary}</ReactMarkdown>
      </div>

      <hr className="w-full border border-(--color-border)" aria-hidden="true" />

      <TopNames />
      <TopSurnames />
      <LongestNames />
      <NamesSurnamesDiversity />
      <TopSchools />
      <MostConstantsSchools />
      <SchoolsEvolution />
      <CommonNameBySchool />
      <TotalParticipants />

      <hr className="w-full border border-(--color-border)" aria-hidden="true" />

      <div className="w-full text-sm sm:text-md md:text-base flex flex-col gap-3">
        <ReactMarkdown rehypePlugins={[rehypeSanitize]}>{stats?.outro[0]?.summary}</ReactMarkdown>
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
