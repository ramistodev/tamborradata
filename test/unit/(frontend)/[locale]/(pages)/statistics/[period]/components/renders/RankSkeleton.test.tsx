import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { RankSkeleton } from '@/app/(frontend)/[locale]/(pages)/statistics/[period]/components/renders/RankSkeleton';

describe('RankSkeleton', () => {
  it('renders the requested number of hidden rows', () => {
    const { container } = render(<RankSkeleton rows={3} />);

    const items = container.querySelectorAll('li');

    expect(items).toHaveLength(3);
    items.forEach((item) => expect(item).toHaveAttribute('aria-hidden', 'true'));
  });

  it('renders nothing for zero rows', () => {
    const { container } = render(<RankSkeleton rows={0} />);

    expect(container.querySelectorAll('li')).toHaveLength(0);
  });
});
