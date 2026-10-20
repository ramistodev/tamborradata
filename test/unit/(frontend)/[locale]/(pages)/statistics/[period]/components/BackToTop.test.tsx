import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { BackToTop } from '@/app/(frontend)/[locale]/(pages)/statistics/[period]/components/BackToTop';
import { installMatchMedia } from '@/test/helpers/matchMedia';
import { messagesByLocale } from '@/test/helpers/messages';
import { renderWithIntl } from '@/test/helpers/renderWithIntl';

const m = messagesByLocale.es;

describe('BackToTop', () => {
  it('renders a button named after the closing message', () => {
    renderWithIntl(<BackToTop />);

    const button = screen.getByRole('button', { name: m.Statistics.closing.backToTop });

    expect(button).toHaveAttribute('type', 'button');
  });

  it('scrolls smoothly to the top of the page', async () => {
    const { user } = renderWithIntl(<BackToTop />);

    await user.click(screen.getByRole('button', { name: m.Statistics.closing.backToTop }));

    expect(window.scrollTo).toHaveBeenCalledTimes(1);
    expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
  });

  it('scrolls instantly when the user prefers reduced motion', async () => {
    installMatchMedia({ '(prefers-reduced-motion: reduce)': true });
    const { user } = renderWithIntl(<BackToTop />);

    await user.click(screen.getByRole('button', { name: m.Statistics.closing.backToTop }));

    expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'instant' });
  });
});
