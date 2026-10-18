'use client';
import { useTranslations } from 'next-intl';
import { formatNumber } from '../../../lib/format';
import { Icons } from '../../../components/Icons';
import { useAside } from '../hooks/useAside';

export function SectionAside({ sections }: { sections: { id: string; title: string }[] }) {
  const t = useTranslations('PrivacyPolicy.aside');
  const { activeId, dialogRef, open, openDialog, closeDialog, handleClose, handleDialogClick } =
    useAside(sections.map((section) => section.id));

  const nav = (onNavigate?: () => void) => (
    <nav aria-label={t('title')} className="w-full flex flex-col">
      {sections.map((section, index) => {
        const isActive = section.id === activeId;

        return (
          <a
            key={section.id}
            href={`#${section.id}`}
            onClick={onNavigate}
            aria-current={isActive ? 'location' : undefined}
            className={`flex gap-2 w-full text-sm font-mono border-l px-4 py-2 transition-colors ${
              isActive
                ? 'text-accent border-accent'
                : 'text-text-secondary hover:text-text border-border'
            }`}
          >
            <span>{formatNumber(index + 1)}</span>
            <span className="ml-2">{section.title}</span>
          </a>
        );
      })}
    </nav>
  );

  return (
    <>
      {/* Large screens: always visible and sticky */}
      <aside className="hidden lg:flex sticky top-28 w-full flex-col gap-4 px-3 sm:px-6">
        <span className="font-mono text-text-secondary uppercase leading-snug text-sm">
          {t('title')}
        </span>
        {nav()}
      </aside>

      {/* Small screens: a tab on the left edge opens the same list in a dialog */}
      <button
        type="button"
        aria-label={t('open')}
        aria-haspopup="dialog"
        aria-controls="privacy-aside"
        aria-expanded={open}
        onClick={openDialog}
        className="lg:hidden fixed left-0 top-2/5 z-40 -translate-y-1/2 cursor-pointer rounded-r-md border border-l-0 border-border bg-bg p-2 text-text-secondary transition-colors hover:border-accent hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        <Icons.ChevronRight />
      </button>

      <dialog
        ref={dialogRef}
        id="privacy-aside"
        aria-label={t('title')}
        onClose={handleClose}
        onClick={handleDialogClick}
        className="fixed inset-y-0 left-0 right-auto m-0 h-dvh max-h-none w-2/3 max-w-none -translate-x-full flex-col border-r border-border bg-bg p-0 text-text transition-[translate,overlay,display] transition-discrete duration-300 ease-out open:flex open:translate-x-0 starting:open:-translate-x-full motion-reduce:transition-none backdrop:bg-black/0 backdrop:backdrop-blur-none backdrop:transition-[background-color,backdrop-filter,overlay,display] backdrop:transition-discrete backdrop:duration-300 open:backdrop:bg-black/30 open:backdrop:backdrop-blur-sm starting:open:backdrop:bg-black/0 starting:open:backdrop:backdrop-blur-none lg:hidden"
      >
        <div className="flex shrink-0 items-center justify-between px-6 pt-5 pb-3">
          <span className="font-mono text-text-secondary uppercase leading-snug text-sm">
            {t('title')}
          </span>
          <button
            type="button"
            aria-label={t('close')}
            onClick={closeDialog}
            className="cursor-pointer rounded-md p-2 text-text-secondary transition-colors hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            <span className="block rotate-180">
              <Icons.ChevronRight />
            </span>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 pb-8">{nav(closeDialog)}</div>
      </dialog>
    </>
  );
}
