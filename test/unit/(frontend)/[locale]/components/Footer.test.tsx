import { screen } from '@testing-library/react';
import { createTranslator } from 'next-intl';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Footer } from '@/app/(frontend)/[locale]/components/Footer';
import { repositoryUrl } from '@/app/(frontend)/[locale]/config/constants';
import { messagesByLocale } from '@/test/helpers/messages';
import { renderWithIntl } from '@/test/helpers/renderWithIntl';

const m = messagesByLocale.es;

describe('Footer', () => {
  beforeEach(() => {
    vi.useFakeTimers({ now: new Date('2026-03-10T12:00:00.000Z') });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders the contentinfo landmark', () => {
    renderWithIntl(<Footer />);

    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
  });

  it('links to the privacy policy', () => {
    renderWithIntl(<Footer />);

    expect(screen.getByRole('link', { name: m.Footer.policyPrivacy })).toHaveAttribute('href', '/privacy-policy');
  });

  it('links to the repository in a new tab safely', () => {
    renderWithIntl(<Footer />);

    const link = screen.getByRole('link', { name: m.Footer.openSource });

    expect(link).toHaveAttribute('href', repositoryUrl);
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('includes the buy me a coffee link', () => {
    renderWithIntl(<Footer />);

    expect(screen.getByRole('link', { name: /Invítame a un café/ })).toBeInTheDocument();
  });

  it('renders the copyright with the current year', () => {
    renderWithIntl(<Footer />);

    const t = createTranslator({ locale: 'es', messages: m, namespace: 'Footer' } as never) as unknown as (
      key: string,
      values: Record<string, number>,
    ) => string;
    const expected = t('copyright', { year: 2026 });

    expect(expected).toContain('2026');
    expect(screen.getByText(expected)).toBeInTheDocument();
  });

  it.each([
    ['en', '/en/privacy-policy'],
    ['eu', '/eu/privacy-policy'],
  ] as const)('localizes the privacy link and the texts for %s', (locale, href) => {
    renderWithIntl(<Footer />, { locale });

    const footerMessages = messagesByLocale[locale].Footer;

    expect(screen.getByRole('link', { name: footerMessages.policyPrivacy })).toHaveAttribute('href', href);
    expect(screen.getByRole('link', { name: footerMessages.openSource })).toBeInTheDocument();
  });
});
