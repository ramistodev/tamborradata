import { useTranslations } from 'next-intl';
import { P, Ul, rich } from './Prose';

export function CookiesSection() {
  const t = useTranslations('PrivacyPolicy.sections.cookies');

  return (
    <>
      <P>{t('p1')}</P>
      <Ul>
        <li>{t.rich('i1', rich)}</li>
        <li>{t.rich('i2', rich)}</li>
        <li>{t.rich('i3', rich)}</li>
      </Ul>
      <P>{t('p2')}</P>
    </>
  );
}
