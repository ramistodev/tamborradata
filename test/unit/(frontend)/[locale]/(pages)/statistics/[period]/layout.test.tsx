import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import PeriodLayout from '@/app/(frontend)/[locale]/(pages)/statistics/[period]/layout';

describe('PeriodLayout', () => {
  it('renders its children inside a two-thirds wide column on large screens', () => {
    const { container } = render(
      <PeriodLayout>
        <p>child</p>
      </PeriodLayout>,
    );

    const wrapper = container.firstElementChild;
    expect(wrapper?.tagName).toBe('DIV');
    expect(wrapper).toHaveClass('lg:w-2/3');
    expect(wrapper).toContainElement(screen.getByText('child'));
  });
});
