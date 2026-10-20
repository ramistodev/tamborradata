import { describe, expect, it } from 'vitest';
import { screen } from '@testing-library/react';
import { SearchPrompt } from '@/app/(frontend)/[locale]/(pages)/search-participants/components/status/SearchPrompt';
import { messagesByLocale, LOCALES } from '@/test/helpers/messages';
import { renderWithIntl } from '@/test/helpers/renderWithIntl';

describe('SearchPrompt', () => {
  it.each(LOCALES)('renders the prompt heading and description for %s', (locale) => {
    const m = messagesByLocale[locale].Search.status.prompt;

    renderWithIntl(<SearchPrompt />, { locale });

    expect(screen.getByRole('heading', { level: 3, name: m.title })).toBeInTheDocument();
    expect(screen.getByText(m.description)).toBeInTheDocument();
  });
});
