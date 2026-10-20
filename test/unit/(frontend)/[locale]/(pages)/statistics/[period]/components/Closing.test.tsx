import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Closing } from '@/app/(frontend)/[locale]/(pages)/statistics/[period]/components/Closing';
import { makePeriodList } from '@/test/fixtures/period';
import { messagesByLocale } from '@/test/helpers/messages';
import { renderWithIntl } from '@/test/helpers/renderWithIntl';

const m = messagesByLocale.es;
const outro = { section: 'periodOutro', summary: 'Outro text' } as const;

describe('Closing', () => {
  it('renders a focusable closing section', () => {
    const { container } = renderWithIntl(<Closing periods={makePeriodList()} currentPeriod="2024" outro={outro} />);

    const section = container.querySelector('section#closing');

    expect(section).not.toBeNull();
    expect(section).toHaveAttribute('tabindex', '-1');
  });

  it('renders the outro through markdown', () => {
    const { container } = renderWithIntl(
      <Closing periods={makePeriodList()} currentPeriod="2024" outro={{ section: 'periodOutro', summary: 'Outro **bold**' }} />,
    );

    expect(screen.getByText('bold').tagName).toBe('STRONG');
    expect(container.querySelector('p')).toHaveTextContent('Outro bold');
  });

  it('renders the outro text', () => {
    renderWithIntl(<Closing periods={makePeriodList()} currentPeriod="2024" outro={outro} />);

    expect(screen.getByText('Outro text')).toBeInTheDocument();
  });

  it('renders no markdown paragraph for an empty outro', () => {
    const { container } = renderWithIntl(
      <Closing periods={makePeriodList()} currentPeriod="2024" outro={{ section: 'periodOutro', summary: '' }} />,
    );

    expect(container.querySelector('p')).toBeNull();
  });

  it('includes the neighbour editions navigation and the back to top button', () => {
    renderWithIntl(<Closing periods={makePeriodList()} currentPeriod="2024" outro={outro} />);

    const nav = screen.getByRole('navigation', { name: m.Statistics.closing.navLabel });

    expect(nav).toBeInTheDocument();
    expect(screen.getByRole('link', { name: new RegExp(m.Statistics.closing.newer) })).toHaveAttribute('href', '/statistics/2025');
    expect(screen.getByRole('button', { name: m.Statistics.closing.backToTop })).toBeInTheDocument();
  });
});
