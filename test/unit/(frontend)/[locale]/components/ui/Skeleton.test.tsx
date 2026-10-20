import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Skeleton } from '@/app/(frontend)/[locale]/components/ui/Skeleton';

describe('Skeleton', () => {
  it('is hidden from assistive technology', () => {
    render(<Skeleton data-testid="skeleton" />);

    expect(screen.getByTestId('skeleton')).toHaveAttribute('aria-hidden', 'true');
  });

  it('pulses', () => {
    render(<Skeleton data-testid="skeleton" />);

    expect(screen.getByTestId('skeleton')).toHaveClass('animate-pulse');
  });

  it('merges the className', () => {
    render(<Skeleton data-testid="skeleton" className="h-4 w-32" />);

    const skeleton = screen.getByTestId('skeleton');

    expect(skeleton).toHaveClass('h-4');
    expect(skeleton).toHaveClass('w-32');
    expect(skeleton).toHaveClass('animate-pulse');
  });
});
