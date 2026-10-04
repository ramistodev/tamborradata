import 'server-only';
import { getTranslations } from 'next-intl/server';
import { DesktopMenu } from './components/DesktopMenu';
import { MobileMenu } from './components/MobileMenu';
import { getPeriods } from '../../services/getPeriods';

export async function Header() {
  const [periods, t] = await Promise.all([getPeriods(), getTranslations('Header')]);

  return (
    <header
      role="banner"
      className="w-full sticky top-0 z-500 border-border border-b before:absolute before:inset-0 before:-z-10 before:bg-bg/85 before:backdrop-blur-md"
    >
      {/* First focusable element on every page: lets keyboard users skip the navigation */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-4 focus:z-10 focus:rounded-md focus:border focus:border-accent focus:bg-bg focus:px-3 focus:py-2 focus:text-sm focus:text-accent focus:outline-none"
      >
        {t('skipToContent')}
      </a>

      <nav
        aria-label={t('navLabel')}
        className="hidden md:flex relative w-full items-center justify-center gap-7 py-4 px-6"
      >
        <DesktopMenu periods={periods} />
      </nav>

      {/* On mobile the navigation is the <nav> inside the menu panel */}
      <div className="md:hidden">
        <MobileMenu periods={periods} />
      </div>
    </header>
  );
}
