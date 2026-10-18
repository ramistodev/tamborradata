import { useTranslations } from 'next-intl';
import { P, Ul, rich } from './Prose';

export function SearchSection() {
  const t = useTranslations('PrivacyPolicy.sections.search');

  return (
    <>
      <P>{t('p1')}</P>
      <Ul>
        <li>{t.rich('i1', rich)}</li>
        <li>{t.rich('i2', rich)}</li>
        <li>{t.rich('i3', rich)}</li>
        <li>{t.rich('i4', rich)}</li>
        <li>{t.rich('i5', rich)}</li>
      </Ul>
      <P>{t.rich('privacy', rich)}</P>
    </>
  );
}
