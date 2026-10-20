import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import LandingLayout from '@/app/(frontend)/[locale]/(landing)/layout';

describe('LandingLayout', () => {
  it('renders its children inside a full-width background wrapper', () => {
    const { container } = render(
      <LandingLayout>
        <p>child</p>
      </LandingLayout>,
    );

    const wrapper = container.firstElementChild;
    expect(wrapper?.tagName).toBe('DIV');
    expect(wrapper).toHaveClass('bg-bg', 'w-full');
    expect(wrapper).toContainElement(screen.getByText('child'));
  });
});
