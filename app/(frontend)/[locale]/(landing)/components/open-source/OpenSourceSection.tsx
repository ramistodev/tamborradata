import { useTranslations } from 'next-intl';
import { Icons } from '../../../components/Icons';
import { REPO_NAME, REPO_URL, TECH_STACK, buildTerminalLines } from './openSource';
import { TerminalLine } from './TerminalLine';
import { TerminalWindow } from './TerminalWindow';

export function OpenSourceSection() {
  const t = useTranslations('Landing.openSource');
  const tCommon = useTranslations('Landing.common');

  return (
    <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
      <div className="flex flex-col items-start gap-6">
        <h2 className="text-4xl font-extrabold tracking-tight text-balance sm:text-5xl lg:text-6xl">
          {t('title')}
        </h2>
        <p className="text-lg text-text-secondary text-balance">{t('description')}</p>

        <ul
          aria-label={t('stackLabel')}
          className="flex flex-wrap gap-x-4 gap-y-1 font-mono text-sm"
        >
          {TECH_STACK.map((tech) => (
            <li
              key={tech}
              className="text-text-tertiary not-last:after:ml-4 not-last:after:content-['/']"
            >
              {tech}
            </li>
          ))}
        </ul>

        <a
          href={REPO_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex w-fit items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-bg transition-opacity duration-200 hover:opacity-85 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent motion-reduce:transition-none"
        >
          <Icons.GithubIcon className="size-5" />
          {t('cta')}
          <Icons.ArrowRight className="size-4" />
          <span className="sr-only">{tCommon('newTab')}</span>
        </a>
      </div>

      <TerminalWindow title={REPO_NAME}>
        {buildTerminalLines(t('terminal.installed')).map((line) => (
          <TerminalLine key={line.text} {...line} />
        ))}
      </TerminalWindow>
    </div>
  );
}
