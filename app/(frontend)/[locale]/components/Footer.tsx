import { useTranslations } from 'next-intl';
import { Link } from '@/app/(frontend)/i18n/navigation';
import { repositoryUrl } from '../config/constants';
import { Icons } from './Icons';

export function Footer() {
  const t = useTranslations('Footer');

  return (
    <footer className="w-full flex flex-col gap-2 items-center justify-center py-4 border-t border-border bg-bg-secondary">
      <Link href="/privacy-policy" className="text-center text-sm text-text-secondary sm:mb-1">
        {t('policyPrivacy')}
      </Link>
      <a
        href={repositoryUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 text-sm text-text-secondary hover:text-text sm:mb-1"
      >
        <Icons.GithubIcon className="size-4" />
        <span>{t('openSource')}</span>
      </a>
      <span className="text-center text-sm text-text-secondary sm:mb-1">
        {t('copyright', { year: new Date().getFullYear() })}
      </span>
    </footer>
  );
}
