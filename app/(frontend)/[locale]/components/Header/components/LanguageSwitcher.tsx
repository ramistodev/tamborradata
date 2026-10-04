'use client';
import { useTranslations } from 'next-intl';
import { useChangeLocale } from '@/app/(frontend)/i18n/useChangeLocale';
import type { Locale } from '../../../../../types/locale';

const languages: { locale: Locale; code: string; name: string }[] = [
  { locale: 'es', code: 'ES', name: 'Español' },
  { locale: 'en', code: 'EN', name: 'English' },
  { locale: 'eu', code: 'EU', name: 'Euskara' },
];

export function LanguageSwitcher() {
  const t = useTranslations('Header');
  const { locale, changeLocale, isPending } = useChangeLocale();

  return (
    <div
      role="group"
      aria-label={t('language')}
      className={`flex items-center font-mono text-sm transition-opacity ${isPending ? 'opacity-60' : ''}`}
    >
      {languages.map((language, index) => {
        const isActive = language.locale === locale;

        return (
          <span key={language.locale} className="flex items-center">
            {index > 0 && (
              <span aria-hidden="true" className="text-text-tertiary">
                /
              </span>
            )}
            <button
              type="button"
              lang={language.locale}
              aria-label={language.name}
              aria-current={isActive ? 'true' : undefined}
              disabled={isPending}
              onClick={() => changeLocale(language.locale)}
              className={`min-h-8 min-w-8 cursor-pointer rounded-md px-1.5 py-1 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${isActive ? 'font-semibold text-accent' : 'text-text-secondary hover:text-text'}`}
            >
              {language.code}
            </button>
          </span>
        );
      })}
    </div>
  );
}
