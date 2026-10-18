import { useTranslations } from 'next-intl';
import { P } from './Prose';

export function ChangesSection() {
  const t = useTranslations('PrivacyPolicy.sections.changes');

  return (
    <>
      <P>{t('p1')}</P>
      <P>{t('p2')}</P>
    </>
  );
}
