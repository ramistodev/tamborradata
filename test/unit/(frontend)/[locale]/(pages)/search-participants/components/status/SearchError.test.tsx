import { describe, expect, it, vi } from 'vitest';
import { screen } from '@testing-library/react';
import { SearchError } from '@/app/(frontend)/[locale]/(pages)/search-participants/components/status/SearchError';
import { messagesByLocale } from '@/test/helpers/messages';
import { renderWithIntl } from '@/test/helpers/renderWithIntl';

const m = messagesByLocale.es.Search.status.error;

describe('SearchError', () => {
  it('renders the error heading and description', () => {
    renderWithIntl(<SearchError onRetry={vi.fn()} />);

    expect(screen.getByRole('heading', { level: 3, name: m.title })).toBeInTheDocument();
    expect(screen.getByText(m.description)).toBeInTheDocument();
  });

  it('calls onRetry once per click on the retry button', async () => {
    const onRetry = vi.fn();
    const { user } = renderWithIntl(<SearchError onRetry={onRetry} />);

    await user.click(screen.getByRole('button', { name: m.retry }));

    expect(onRetry).toHaveBeenCalledTimes(1);

    await user.click(screen.getByRole('button', { name: m.retry }));

    expect(onRetry).toHaveBeenCalledTimes(2);
  });
});
