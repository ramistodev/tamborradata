import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ContactSection } from '@/app/(frontend)/[locale]/(landing)/components/contact/ContactSection';
import { LOCALES, messagesByLocale } from '@/test/helpers/messages';
import { renderWithIntl } from '@/test/helpers/renderWithIntl';

const m = messagesByLocale.es.Landing.contact;

describe('ContactSection', () => {
  it('renders the title as a level two heading', () => {
    renderWithIntl(<ContactSection />);

    expect(screen.getByRole('heading', { level: 2, name: m.title })).toBeInTheDocument();
  });

  it('renders the description, the email label and the hint', () => {
    renderWithIntl(<ContactSection />);

    expect(screen.getByText(m.description)).toBeInTheDocument();
    expect(screen.getByText(m.emailLabel)).toBeInTheDocument();
    expect(screen.getByText(m.hint)).toBeInTheDocument();
  });

  it('links the contact address with a mailto', () => {
    renderWithIntl(<ContactSection />);

    expect(screen.getByRole('link', { name: 'contact@tamborradata.com' })).toHaveAttribute(
      'href',
      'mailto:contact@tamborradata.com',
    );
  });

  it.each(LOCALES.filter((locale) => locale !== 'es'))('renders the %s title', (locale) => {
    renderWithIntl(<ContactSection />, { locale });

    expect(
      screen.getByRole('heading', { level: 2, name: messagesByLocale[locale].Landing.contact.title }),
    ).toBeInTheDocument();
  });
});
