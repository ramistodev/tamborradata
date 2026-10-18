import { useTranslations } from 'next-intl';
import { P, Ul, rich } from './Prose';

export function StatisticsSection() {
  const t = useTranslations('PrivacyPolicy.sections.statistics');

  return (
    <>
      <P>{t('p1')}</P>
      <Ul>
        <li>{t.rich('i1', rich)}</li>
        <li>{t('i2')}</li>
        <li>{t('i3')}</li>
      </Ul>
      <P>{t.rich('ai', rich)}</P>
    </>
  );
}
