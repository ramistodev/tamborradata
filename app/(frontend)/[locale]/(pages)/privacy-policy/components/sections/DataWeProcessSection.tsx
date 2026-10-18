import { useTranslations } from 'next-intl';
import { P, Ul, rich } from './Prose';

export function DataWeProcessSection() {
  const t = useTranslations('PrivacyPolicy.sections.data');

  return (
    <>
      <P>{t('intro')}</P>
      <P>{t.rich('participants', rich)}</P>
      <Ul>
        <li>{t('i1')}</li>
        <li>{t('i2')}</li>
        <li>{t('i3')}</li>
        <li>{t('i4')}</li>
        <li>{t('i5')}</li>
      </Ul>
      <P>{t('notStored')}</P>
      <P>{t.rich('visitors', rich)}</P>
    </>
  );
}
