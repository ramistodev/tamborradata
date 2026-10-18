import { useTranslations } from 'next-intl';
import { P, Ul, rich } from './Prose';

export function DataSourcesSection() {
  const t = useTranslations('PrivacyPolicy.sections.sources');

  return (
    <>
      <P>{t('p1')}</P>
      <P>{t('p2')}</P>
      <Ul>
        <li>{t.rich('i1', rich)}</li>
        <li>{t.rich('i2', rich)}</li>
      </Ul>
      <P>{t('p3')}</P>
    </>
  );
}
