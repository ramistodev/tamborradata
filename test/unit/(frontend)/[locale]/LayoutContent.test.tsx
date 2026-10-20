import { screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { LayoutContent } from '@/app/(frontend)/[locale]/LayoutContent';
import { messagesByLocale } from '@/test/helpers/messages';
import { renderWithIntl } from '@/test/helpers/renderWithIntl';

vi.mock('@/app/(frontend)/[locale]/components/Header/Header', () => ({
  Header: () => <header data-testid="header" />,
}));

describe('LayoutContent', () => {
  it('renders the children inside a focusable main landmark', () => {
    renderWithIntl(
      <LayoutContent>
        <p>child</p>
      </LayoutContent>,
    );

    const main = screen.getByRole('main');

    expect(main).toHaveAttribute('id', 'main-content');
    expect(main).toHaveAttribute('tabindex', '-1');
    expect(main).toContainElement(screen.getByText('child'));
  });

  it('orders the header, the main content and the footer', () => {
    const { container } = renderWithIntl(
      <LayoutContent>
        <p>child</p>
      </LayoutContent>,
    );

    expect([...container.children].map((element) => element.tagName)).toEqual(['HEADER', 'MAIN', 'FOOTER']);
  });

  it('renders the real footer', () => {
    renderWithIntl(
      <LayoutContent>
        <p>child</p>
      </LayoutContent>,
    );

    expect(
      screen.getByRole('link', { name: messagesByLocale.es.Footer.policyPrivacy }),
    ).toBeInTheDocument();
  });
});
