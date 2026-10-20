import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { BuyMeACoffeeSection } from '@/app/(frontend)/[locale]/(landing)/components/buy-me-a-coffee/BuyMeACoffeeSection';
import { buyMeACoffeeUrl } from '@/app/(frontend)/[locale]/config/constants';
import { LOCALES, messagesByLocale } from '@/test/helpers/messages';
import { renderWithIntl } from '@/test/helpers/renderWithIntl';

const m = messagesByLocale.es.Landing.buyMeACoffee;

describe('BuyMeACoffeeSection', () => {
  it('renders the title as a level two heading', () => {
    renderWithIntl(<BuyMeACoffeeSection />);

    expect(screen.getByRole('heading', { level: 2, name: m.title })).toBeInTheDocument();
  });

  it('renders both paragraphs and the card text', () => {
    renderWithIntl(<BuyMeACoffeeSection />);

    expect(screen.getByText(m.paragraph1)).toBeInTheDocument();
    expect(screen.getByText(m.paragraph2)).toBeInTheDocument();
    expect(screen.getByText(m.cardText)).toBeInTheDocument();
  });

  it('renders the card label as a paragraph', () => {
    renderWithIntl(<BuyMeACoffeeSection />);

    expect(screen.getByText(m.cardLabel, { selector: 'p' })).toBeInTheDocument();
  });

  it('links to the donation page', () => {
    renderWithIntl(<BuyMeACoffeeSection />);

    expect(screen.getByRole('link', { name: /Invítame a un café/ })).toHaveAttribute('href', buyMeACoffeeUrl);
  });

  it.each(LOCALES.filter((locale) => locale !== 'es'))('renders the %s title', (locale) => {
    renderWithIntl(<BuyMeACoffeeSection />, { locale });

    expect(
      screen.getByRole('heading', { level: 2, name: messagesByLocale[locale].Landing.buyMeACoffee.title }),
    ).toBeInTheDocument();
  });
});
