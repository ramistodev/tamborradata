import { describe, expect, it } from 'vitest';
import { screen } from '@testing-library/react';
import { createTranslator } from 'next-intl';
import { ParticipationRow } from '@/app/(frontend)/[locale]/(pages)/search-participants/components/results/ParticipationRow';
import { messagesByLocale } from '@/test/helpers/messages';
import { renderWithIntl } from '@/test/helpers/renderWithIntl';

const m = messagesByLocale.es;
const row = m.Search.results.row;
const t = createTranslator({
  locale: 'es',
  messages: m,
  namespace: 'Search.results.row',
} as never);

function renderRow(props: { year: number; url: string | null }) {
  return renderWithIntl(
    <ul>
      <ParticipationRow {...props} />
    </ul>,
  );
}

describe('ParticipationRow', () => {
  describe('with a source url', () => {
    it('renders an external link with the source href', () => {
      renderRow({ year: 2024, url: 'https://www.example.org/a' });

      const link = screen.getByRole('link', {
        name: t('viewSourceAriaLabel', { year: '2024', host: 'example.org' }),
      });
      expect(link).toHaveAttribute('href', 'https://www.example.org/a');
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    });

    it('shows the year in a time element, the host without www and the view source text', () => {
      const { container } = renderRow({ year: 2024, url: 'https://www.example.org/a' });

      const time = container.querySelector('time');
      expect(time).toHaveAttribute('datetime', '2024');
      expect(time).toHaveTextContent('2024');
      expect(screen.getByText('example.org')).toBeInTheDocument();
      expect(screen.getByText(row.viewSource)).toBeInTheDocument();
    });

    it('shows the raw string as host when the url cannot be parsed', () => {
      renderRow({ year: 2020, url: 'not a url' });

      expect(screen.getByText('not a url')).toBeInTheDocument();
    });
  });

  describe('without a source url', () => {
    it('renders no link', () => {
      renderRow({ year: 2023, url: null });

      expect(screen.queryByRole('link')).not.toBeInTheDocument();
    });

    it('shows the year, the no source text and a decorative dash', () => {
      const { container } = renderRow({ year: 2023, url: null });

      const time = container.querySelector('time');
      expect(time).toHaveAttribute('datetime', '2023');
      expect(time).toHaveTextContent('2023');
      expect(screen.getByText(row.noSource)).toBeInTheDocument();
      expect(container.querySelector('span[aria-hidden="true"]')).toHaveTextContent('—');
    });
  });
});
