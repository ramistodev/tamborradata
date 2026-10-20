import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { SectionTitle } from '@/app/(frontend)/[locale]/(landing)/components/SectionTitle';

describe('SectionTitle', () => {
  it('pads a single digit index', () => {
    render(<SectionTitle index={1} title="Stats" />);

    expect(screen.getByText('01')).toBeInTheDocument();
  });

  it('shows a two digit index as is', () => {
    render(<SectionTitle index={12} title="Stats" />);

    expect(screen.getByText('12')).toBeInTheDocument();
  });

  it('renders the title text', () => {
    render(<SectionTitle index={3} title="Estadísticas" />);

    expect(screen.getByText('Estadísticas')).toBeInTheDocument();
  });
});
