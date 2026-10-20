import { describe, expect, it } from 'vitest';
import { ResultsSkeleton } from '@/app/(frontend)/[locale]/(pages)/search-participants/components/results/ResultsSkeleton';
import { renderWithIntl } from '@/test/helpers/renderWithIntl';

describe('ResultsSkeleton', () => {
  it('marks the root as busy', () => {
    const { container } = renderWithIntl(<ResultsSkeleton />);

    expect(container.firstElementChild).toHaveAttribute('aria-busy', 'true');
  });

  it('renders one bar, three card bars and three rows of skeleton', () => {
    const { container } = renderWithIntl(<ResultsSkeleton />);

    expect(container.querySelectorAll('[aria-hidden="true"]')).toHaveLength(7);
  });
});
