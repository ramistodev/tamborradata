import { describe, expect, it, vi } from 'vitest';
import { screen } from '@testing-library/react';
import { createTranslator } from 'next-intl';
import { SearchSummary } from '@/app/(frontend)/[locale]/(pages)/search-participants/components/results/SearchSummary';
import { messagesByLocale } from '@/test/helpers/messages';
import { renderWithIntl } from '@/test/helpers/renderWithIntl';

const m = messagesByLocale.es;
const t = createTranslator({
  locale: 'es',
  messages: m,
  namespace: 'Search.results.summary',
} as never);

function renderSummary(onClear = vi.fn()) {
  return renderWithIntl(
    <SearchSummary
      records={2}
      participations={5}
      participant="Ane Garcia Lopez"
      school="Ikastola Test"
      onClear={onClear}
    />,
  );
}

describe('SearchSummary', () => {
  it('shows the record count, the participation count and the query', () => {
    const { container } = renderSummary();

    const text = container.textContent ?? '';
    expect(text).toContain(t('records', { count: 2 }));
    expect(text).toContain(t('participations', { count: 5 }));
    expect(text).toContain(t('query', { participant: 'Ane Garcia Lopez', school: 'Ikastola Test' }));
  });

  it('calls onClear once when the clear button is clicked', async () => {
    const onClear = vi.fn();
    const { user } = renderSummary(onClear);

    await user.click(screen.getByRole('button', { name: m.Search.results.summary.clear }));

    expect(onClear).toHaveBeenCalledTimes(1);
  });
});
