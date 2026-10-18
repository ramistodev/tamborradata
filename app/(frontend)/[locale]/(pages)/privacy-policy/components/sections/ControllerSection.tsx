import { useTranslations } from 'next-intl';
import { P, rich } from './Prose';

export function ControllerSection() {
  const t = useTranslations('PrivacyPolicy.sections.controller');

  return (
    <>
      <P>{t('p1')}</P>
      <P>{t.rich('p2', rich)}</P>
    </>
  );
}
