import { useTranslations } from 'next-intl';
import { P, Ul, rich } from './Prose';

export function DataProcessingSection() {
  const t = useTranslations('PrivacyPolicy.sections.processing');

  return (
    <>
      <P>{t('intro')}</P>
      <Ul>
        <li>{t.rich('i1', rich)}</li>
        <li>{t.rich('i2', rich)}</li>
        <li>{t.rich('i3', rich)}</li>
        <li>{t.rich('i4', rich)}</li>
      </Ul>
      <P>{t('outro')}</P>
    </>
  );
}
