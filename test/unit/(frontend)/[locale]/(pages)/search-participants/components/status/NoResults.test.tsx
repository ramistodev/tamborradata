import { describe, expect, it } from 'vitest';
import { screen } from '@testing-library/react';
import { NoResults } from '@/app/(frontend)/[locale]/(pages)/search-participants/components/status/NoResults';
import { messagesByLocale, LOCALES } from '@/test/helpers/messages';
import { renderWithIntl } from '@/test/helpers/renderWithIntl';

describe('NoResults', () => {
  it.each(LOCALES)('renders the no results heading and description for %s', (locale) => {
    const m = messagesByLocale[locale].Search.status.noResults;

    renderWithIntl(<NoResults />, { locale });

    expect(screen.getByRole('heading', { level: 3, name: m.title })).toBeInTheDocument();
    expect(screen.getByText(m.description)).toBeInTheDocument();
  });
});
