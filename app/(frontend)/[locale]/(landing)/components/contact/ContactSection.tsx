import { useTranslations } from 'next-intl';
import { Icons } from '../../../components/Icons';
import { contactEmail } from '../../../config/constants';

export function ContactSection() {
  const t = useTranslations('Landing.contact');

  return (
    <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
      <div className="flex flex-col items-start gap-6">
        <h2 className="text-4xl font-extrabold tracking-tight text-balance sm:text-5xl lg:text-6xl">
          {t('title')}
        </h2>
        <p className="text-lg text-text-secondary text-balance">{t('description')}</p>
      </div>

      <div className="flex flex-col gap-6 rounded-2xl border border-border bg-bg-secondary p-6 sm:p-10">
        <div className="flex items-center gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-full border border-border text-accent">
            <Icons.MailIcon className="size-5" />
          </span>
          <span className="font-mono text-xs uppercase tracking-widest text-text-tertiary">
            {t('emailLabel')}
          </span>
        </div>

        {/* One line always: the sizes are picked so the address fits the card at every width */}
        <a
          href={`mailto:${contactEmail}`}
          className="w-fit max-w-full rounded-sm text-lg font-semibold whitespace-nowrap text-accent hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent sm:text-2xl lg:text-xl xl:text-2xl"
        >
          {contactEmail}
        </a>

        <p className="border-t border-border pt-4 text-sm text-text-secondary">{t('hint')}</p>
      </div>
    </div>
  );
}
