import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, fireEvent, screen } from '@testing-library/react';
import { createTranslator } from 'next-intl';
import { SearchRateLimited } from '@/app/(frontend)/[locale]/(pages)/search-participants/components/status/SearchRateLimited';
import { messagesByLocale } from '@/test/helpers/messages';
import { renderWithIntl } from '@/test/helpers/renderWithIntl';

const m = messagesByLocale.es;
const rl = m.Search.status.rateLimited;
const t = createTranslator({
  locale: 'es',
  messages: m,
  namespace: 'Search.status.rateLimited',
} as never);

function advance(ms: number): void {
  act(() => {
    vi.advanceTimersByTime(ms);
  });
}

describe('SearchRateLimited', () => {
  beforeEach(() => {
    vi.useFakeTimers({ now: new Date('2026-03-10T12:00:00.000Z') });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders the title and the initial countdown with a disabled retry button', () => {
    renderWithIntl(<SearchRateLimited retryAfterSeconds={90} onRetry={vi.fn()} />);

    expect(screen.getByRole('heading', { level: 3, name: rl.title })).toBeInTheDocument();
    expect(screen.getByText(t('countdown', { minutes: 1, seconds: 30 }))).toBeInTheDocument();
    expect(screen.getByRole('button', { name: rl.retry })).toBeDisabled();
  });

  it('updates the countdown as time passes', () => {
    renderWithIntl(<SearchRateLimited retryAfterSeconds={90} onRetry={vi.fn()} />);

    advance(31_000);

    expect(screen.getByText(t('countdown', { minutes: 0, seconds: 59 }))).toBeInTheDocument();
  });

  it('shows the ready message and enables the button when the countdown ends', () => {
    renderWithIntl(<SearchRateLimited retryAfterSeconds={90} onRetry={vi.fn()} />);

    advance(31_000);
    advance(59_000);

    expect(screen.getByText(rl.ready)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: rl.retry })).toBeEnabled();
  });

  it('calls onRetry once when the enabled button is clicked', () => {
    const onRetry = vi.fn();
    renderWithIntl(<SearchRateLimited retryAfterSeconds={90} onRetry={onRetry} />);

    advance(90_000);
    fireEvent.click(screen.getByRole('button', { name: rl.retry }));

    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('is ready at once when there is nothing to wait for', () => {
    renderWithIntl(<SearchRateLimited retryAfterSeconds={0} onRetry={vi.fn()} />);

    expect(screen.getByText(rl.ready)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: rl.retry })).toBeEnabled();
  });

  it('never calls onRetry while the button is disabled', () => {
    const onRetry = vi.fn();
    renderWithIntl(<SearchRateLimited retryAfterSeconds={90} onRetry={onRetry} />);

    fireEvent.click(screen.getByRole('button', { name: rl.retry }));

    expect(onRetry).not.toHaveBeenCalled();
  });
});
