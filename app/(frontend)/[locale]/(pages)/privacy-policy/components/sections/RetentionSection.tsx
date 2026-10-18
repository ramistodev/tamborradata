import { useTranslations } from 'next-intl';
import { P } from './Prose';

export function RetentionSection() {
  const t = useTranslations('PrivacyPolicy.sections.retention');

  return (
    <>
      <P>{t('p1')}</P>
      <P>{t('p2')}</P>
      <P>{t('p3')}</P>
    </>
  );
}
