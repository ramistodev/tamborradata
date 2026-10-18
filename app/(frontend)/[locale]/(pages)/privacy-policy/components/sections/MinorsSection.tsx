import { useTranslations } from 'next-intl';
import { P, rich } from './Prose';

export function MinorsSection() {
  const t = useTranslations('PrivacyPolicy.sections.minors');

  return (
    <>
      <P>{t.rich('p1', rich)}</P>
      <P>{t('p2')}</P>
      <P>{t('p3')}</P>
    </>
  );
}
