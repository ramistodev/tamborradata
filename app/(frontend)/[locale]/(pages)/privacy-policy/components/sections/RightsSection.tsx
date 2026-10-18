import { useTranslations } from 'next-intl';
import { P, Ul, rich } from './Prose';

export function RightsSection() {
  const t = useTranslations('PrivacyPolicy.sections.rights');

  return (
    <>
      <P>{t('intro')}</P>
      <Ul>
        <li>{t('i1')}</li>
        <li>{t('i2')}</li>
        <li>{t('i3')}</li>
        <li>{t('i4')}</li>
      </Ul>
      <P>{t.rich('remove', rich)}</P>
      <P>{t('response')}</P>
      <P>{t('limits')}</P>
    </>
  );
}
