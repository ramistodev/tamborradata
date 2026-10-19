import { useLocale } from 'next-intl';
import type { Locale } from '../../../../types/locale';
import { buyMeACoffeeUrl } from '../../config/constants';

const TEXT: Record<Locale, { cta: string; newTab: string }> = {
  es: { cta: 'Invítame a un café', newTab: '(se abre en una pestaña nueva)' },
  en: { cta: 'Invite me for a coffee', newTab: '(opens in a new tab)' },
  eu: { cta: 'Gonbida nazazu kafe batera', newTab: '(fitxa berri batean irekitzen da)' },
};

export function BuyMeACoffee() {
  const { cta, newTab } = TEXT[useLocale()];

  return (
    <a
      href={buyMeACoffeeUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex w-fit items-center gap-3 rounded-xl border-2 border-black bg-[#4d8cff] px-6 py-3 text-sm md:text-lg font-semibold text-black shadow-[3px_3px_0_#000] transition-transform duration-200 hover:-translate-x-px hover:-translate-y-px focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent motion-reduce:transition-none"
    >
      <span aria-hidden="true">☕</span>
      {cta}
      <span className="sr-only">{newTab}</span>
    </a>
  );
}
