import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { SectionLayout } from '@/app/(frontend)/[locale]/(landing)/components/SectionLayout';

describe('SectionLayout', () => {
  it('is a region named after its title', () => {
    render(
      <SectionLayout index={1} title="Estadísticas">
        <p>content</p>
      </SectionLayout>,
    );

    expect(screen.getByRole('region', { name: 'Estadísticas' })).toBeInTheDocument();
  });

  it('renders the children inside the region', () => {
    render(
      <SectionLayout index={1} title="Estadísticas">
        <p>content</p>
      </SectionLayout>,
    );

    const region = screen.getByRole('region', { name: 'Estadísticas' });

    expect(within(region).getByText('content')).toBeInTheDocument();
  });

  it('shows the padded index', () => {
    render(
      <SectionLayout index={3} title="Estadísticas">
        <p>content</p>
      </SectionLayout>,
    );

    expect(screen.getByText('03')).toBeInTheDocument();
  });

  it('adds the secondary background only with secondaryBg', () => {
    const { rerender } = render(
      <SectionLayout index={1} title="Estadísticas" secondaryBg>
        <p>content</p>
      </SectionLayout>,
    );
    expect(screen.getByRole('region', { name: 'Estadísticas' })).toHaveClass('bg-bg-secondary');

    rerender(
      <SectionLayout index={1} title="Estadísticas">
        <p>content</p>
      </SectionLayout>,
    );
    expect(screen.getByRole('region', { name: 'Estadísticas' })).not.toHaveClass('bg-bg-secondary');
  });
});
