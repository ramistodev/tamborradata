import { useTranslations } from 'next-intl';

export function Footer() {
  const t = useTranslations('Footer');

  return (
    <footer className="w-full text-center text-sm text-text-secondary py-2 mt-8 mb-5 sm:mb-1">
      <span>{t('copyright', { year: new Date().getFullYear() })}</span>
    </footer>
  );
}
