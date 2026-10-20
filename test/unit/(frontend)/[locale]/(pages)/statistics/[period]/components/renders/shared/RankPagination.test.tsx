import { createTranslator } from 'next-intl';
import { screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { RankPagination } from '@/app/(frontend)/[locale]/(pages)/statistics/[period]/components/renders/shared/RankPagination';
import { messagesByLocale } from '@/test/helpers/messages';
import { renderWithIntl } from '@/test/helpers/renderWithIntl';

const m = messagesByLocale.es;
const t = createTranslator({ locale: 'es', messages: m, namespace: 'Statistics.layout' });

function props(overrides: Partial<Parameters<typeof RankPagination>[0]> = {}) {
  return {
    shown: 10,
    hasMore: false,
    canCollapse: false,
    isLoading: false,
    hasError: false,
    onLoadMore: vi.fn(),
    onCollapse: vi.fn(),
    ...overrides,
  };
}

describe('RankPagination', () => {
  it('announces how many results are shown', () => {
    renderWithIntl(<RankPagination {...props()} />);

    expect(screen.getByRole('status')).toHaveTextContent(t('shown', { count: 10 }));
    expect(screen.getByRole('status')).toHaveTextContent('Mostrando 10 resultados');
  });

  it('renders no buttons when there is nothing to expand or collapse', () => {
    renderWithIntl(<RankPagination {...props()} />);

    expect(screen.queryAllByRole('button')).toHaveLength(0);
  });

  describe('show more', () => {
    it('renders the next range and calls onLoadMore on click', async () => {
      const onLoadMore = vi.fn();
      const { user } = renderWithIntl(<RankPagination {...props({ hasMore: true, onLoadMore })} />);

      const button = screen.getByRole('button', { name: /Mostrar más/ });
      await user.click(button);

      expect(button).toHaveTextContent('11-20');
      expect(onLoadMore).toHaveBeenCalledTimes(1);
    });

    it('computes the range from the rows shown', () => {
      renderWithIntl(<RankPagination {...props({ hasMore: true, shown: 30 })} />);

      expect(screen.getByRole('button', { name: /Mostrar más/ })).toHaveTextContent('31-40');
    });

    it('is disabled and busy while loading', () => {
      renderWithIntl(<RankPagination {...props({ hasMore: true, isLoading: true })} />);

      const button = screen.getByRole('button', { name: /Mostrar más/ });

      expect(button).toBeDisabled();
      expect(button).toHaveAttribute('aria-busy', 'true');
    });

    it('is not busy when idle', () => {
      renderWithIntl(<RankPagination {...props({ hasMore: true })} />);

      expect(screen.getByRole('button', { name: /Mostrar más/ })).toHaveAttribute('aria-busy', 'false');
    });
  });

  describe('show less', () => {
    it('renders the first range and calls onCollapse on click', async () => {
      const onCollapse = vi.fn();
      const { user } = renderWithIntl(<RankPagination {...props({ canCollapse: true, onCollapse })} />);

      const button = screen.getByRole('button', { name: /Mostrar menos/ });
      await user.click(button);

      expect(button).toHaveTextContent('1-10');
      expect(onCollapse).toHaveBeenCalledTimes(1);
    });

    it('is disabled while loading', () => {
      renderWithIntl(<RankPagination {...props({ canCollapse: true, isLoading: true })} />);

      expect(screen.getByRole('button', { name: /Mostrar menos/ })).toBeDisabled();
    });
  });

  describe('error state', () => {
    it('shows an alert with a retry button instead of the show more button', async () => {
      const onLoadMore = vi.fn();
      const { user } = renderWithIntl(<RankPagination {...props({ hasMore: true, hasError: true, onLoadMore })} />);

      const alert = screen.getByRole('alert');
      await user.click(screen.getByRole('button', { name: m.Statistics.layout.retry }));

      expect(alert).toHaveTextContent(m.Statistics.layout.loadError);
      expect(onLoadMore).toHaveBeenCalledTimes(1);
      expect(screen.queryByRole('button', { name: /Mostrar más/ })).not.toBeInTheDocument();
    });

    it('shows the regular disabled show more button while the retry is loading', () => {
      renderWithIntl(<RankPagination {...props({ hasMore: true, hasError: true, isLoading: true })} />);

      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Mostrar más/ })).toBeDisabled();
    });

    it('shows no alert when there is nothing more to load', () => {
      renderWithIntl(<RankPagination {...props({ hasMore: false, hasError: true })} />);

      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });
  });
});
