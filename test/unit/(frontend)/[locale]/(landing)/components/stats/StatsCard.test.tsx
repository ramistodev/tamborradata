import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { StatsCard } from '@/app/(frontend)/[locale]/(landing)/components/stats/StatsCard';
import { statsCardTones } from '@/app/(frontend)/[locale]/(landing)/components/stats/statsCardTone';
import { renderWithIntl } from '@/test/helpers/renderWithIntl';

const baseProps = {
  tone: 'surface' as const,
  label: 'Label text',
  value: '1.234',
  summary: 'Summary text',
  cta: { label: 'Go to stats', href: '/statistics/2024' },
};

describe('StatsCard', () => {
  it('renders the label, value and summary', () => {
    renderWithIntl(<StatsCard {...baseProps} />);

    expect(screen.getByText('Label text')).toBeInTheDocument();
    expect(screen.getByText('1.234')).toBeInTheDocument();
    expect(screen.getByText('Summary text')).toBeInTheDocument();
  });

  describe('finalText', () => {
    it('hides the value and summary and reads the final text instead', () => {
      const { container } = renderWithIntl(<StatsCard {...baseProps} finalText="Final sentence" />);

      const wrapper = screen.getByText('1.234').parentElement;

      expect(wrapper).toHaveAttribute('aria-hidden', 'true');
      expect(wrapper).toContainElement(screen.getByText('Summary text'));
      expect(screen.getByText('Final sentence')).toHaveClass('sr-only');
      expect(container.querySelectorAll('.sr-only')).toHaveLength(1);
    });

    it('leaves everything visible and adds no sr-only paragraph without it', () => {
      const { container } = renderWithIntl(<StatsCard {...baseProps} />);

      expect(screen.getByText('1.234').parentElement).not.toHaveAttribute('aria-hidden');
      expect(container.querySelector('.sr-only')).toBeNull();
    });
  });

  describe('optional slots', () => {
    it('renders the badge, timeline, children and note when given', () => {
      renderWithIntl(
        <StatsCard
          {...baseProps}
          badge={<span>badge slot</span>}
          timeline={<span>timeline slot</span>}
          note="Note text"
        >
          <span>children slot</span>
        </StatsCard>,
      );

      expect(screen.getByText('badge slot')).toBeInTheDocument();
      expect(screen.getByText('timeline slot')).toBeInTheDocument();
      expect(screen.getByText('children slot')).toBeInTheDocument();
      expect(screen.getByText('Note text')).toBeInTheDocument();
    });

    it('omits the note when it is not given', () => {
      const { container } = renderWithIntl(<StatsCard {...baseProps} />);

      expect(container.querySelectorAll('p')).toHaveLength(1);
    });
  });

  describe('call to action', () => {
    it('is a link with the localized href', () => {
      renderWithIntl(<StatsCard {...baseProps} />);

      expect(screen.getByRole('link', { name: 'Go to stats' })).toHaveAttribute('href', '/statistics/2024');
    });

    it('prefixes the href for the en locale', () => {
      renderWithIntl(<StatsCard {...baseProps} />, { locale: 'en' });

      expect(screen.getByRole('link', { name: 'Go to stats' })).toHaveAttribute('href', '/en/statistics/2024');
    });
  });

  describe('tone', () => {
    it.each(['surface', 'accent'] as const)('applies the %s card classes to the article', (tone) => {
      renderWithIntl(<StatsCard {...baseProps} tone={tone} />);

      expect(screen.getByRole('article').className).toContain(statsCardTones[tone].card);
    });
  });
});
