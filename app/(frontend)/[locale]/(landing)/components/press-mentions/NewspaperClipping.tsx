import { useTranslations } from 'next-intl';
import { Icons } from '../../../components/Icons';
import { pressArticle } from './pressArticle';

/**
 * The article drawn as a newspaper clipping, in plain HTML and CSS. It is paper, so its colours are
 * fixed and do not follow the light/dark theme. The whole clipping is the link to the article.
 *
 * The paper is a real Spanish document: its publication, date, headline and byline are not
 * translated and are marked `lang="es"`. Only the "Read the article" line and the link's accessible
 * name belong to the website and follow its language.
 */
export function NewspaperClipping() {
  const t = useTranslations('Landing.press.clipping');
  const tCommon = useTranslations('Landing.common');
  const { publication, host, section, headline, author, isoDate, displayDate, url } = pressArticle;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block -rotate-1 rounded-md bg-[#f1ece0] p-6 text-[#1b1b1b] shadow-2xl shadow-black/50 transition duration-300 hover:rotate-0 hover:-translate-y-1 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent motion-reduce:transition-none motion-reduce:hover:translate-y-0 sm:p-10"
    >
      <header lang="es" className="flex flex-col gap-2">
        <div className="flex items-end justify-between gap-4 font-mono text-[10px] uppercase tracking-widest text-[#555] sm:text-xs">
          <span>{publication}</span>
          <time dateTime={isoDate}>{displayDate}</time>
        </div>
        {/* Masthead rule: thick, thin, thin */}
        <div aria-hidden="true" className="flex flex-col gap-0.5">
          <span className="h-0.75 bg-[#1b1b1b]" />
          <span className="h-px bg-[#1b1b1b]" />
          <span className="h-px bg-[#1b1b1b]" />
        </div>
      </header>

      <div lang="es" className="flex flex-col gap-4 pt-8 pb-10 sm:pt-10 sm:pb-14">
        <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#b5372e] sm:text-xs">
          {section}
        </p>
        <h3 className="font-serif truncate text-3xl leading-[1.05] font-bold tracking-tight text-balance sm:text-5xl">
          {headline}
        </h3>
        <p className="font-serif text-sm sm:text-base">
          <i className="text-[#555]">Por</i> <b>{author}</b>
        </p>
      </div>

      <footer className="flex items-center justify-between gap-4 border-t border-[#1b1b1b]/30 pt-4 text-xs sm:text-sm">
        <span className="font-medium">
          {t('read')}{' '}
          <Icons.ArrowRight className="ml-1 inline size-4 align-text-bottom transition-transform group-hover:translate-x-1 motion-reduce:transition-none" />
        </span>
        <span className="font-mono text-[10px] text-[#555] sm:text-xs">{host}</span>
        <span className="sr-only">{tCommon('newTab')}</span>
      </footer>
    </a>
  );
}
