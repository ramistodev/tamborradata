import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { BuyMeACoffee } from '@/app/(frontend)/[locale]/components/ui/BuyMeACoffee';
import { buyMeACoffeeUrl } from '@/app/(frontend)/[locale]/config/constants';
import { renderWithIntl } from '@/test/helpers/renderWithIntl';

describe('BuyMeACoffee', () => {
  it('opens the donation page in a new tab safely', () => {
    renderWithIntl(<BuyMeACoffee />);

    const link = screen.getByRole('link');

    expect(link).toHaveAttribute('href', buyMeACoffeeUrl);
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it.each([
    ['es', 'Invítame a un café', '(se abre en una pestaña nueva)'],
    ['en', 'Invite me for a coffee', '(opens in a new tab)'],
    ['eu', 'Gonbida nazazu kafe batera', '(fitxa berri batean irekitzen da)'],
  ] as const)('shows the %s texts', (locale, cta, newTab) => {
    renderWithIntl(<BuyMeACoffee />, { locale });

    const link = screen.getByRole('link', { name: new RegExp(cta) });

    expect(link).toHaveTextContent(cta);
    expect(link).toHaveTextContent(newTab);
  });
});
