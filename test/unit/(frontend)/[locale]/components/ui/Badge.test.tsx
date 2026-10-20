import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Badge } from '@/app/(frontend)/[locale]/components/ui/Badge';

describe('Badge', () => {
  it('renders its children inside a span', () => {
    render(<Badge>Label</Badge>);

    expect(screen.getByText('Label').tagName).toBe('SPAN');
  });

  it('renders no value element by default', () => {
    render(<Badge data-testid="badge">Label</Badge>);

    expect(screen.getByTestId('badge').children).toHaveLength(0);
  });

  it('renders a zero value', () => {
    render(
      <Badge data-testid="badge" value={0}>
        Label
      </Badge>,
    );

    expect(screen.getByTestId('badge').children).toHaveLength(1);
    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('renders the value after the label', () => {
    render(
      <Badge data-testid="badge" value="12">
        Label
      </Badge>,
    );

    expect(screen.getByTestId('badge')).toHaveTextContent('Label12');
    expect(screen.getByText('12')).toBeInTheDocument();
  });

  it.each([
    ['neutral', 'border-border'],
    ['accent', 'border-accent/40'],
    ['success', 'border-border-success'],
    ['danger', 'border-border-danger'],
  ] as const)('applies the %s tone border', (tone, expectedClass) => {
    render(
      <Badge tone={tone} data-testid="badge">
        Label
      </Badge>,
    );

    expect(screen.getByTestId('badge')).toHaveClass(expectedClass);
  });

  it('forwards extra props and the className', () => {
    render(
      <Badge aria-label="Total" data-testid="badge" className="custom">
        Label
      </Badge>,
    );

    const badge = screen.getByTestId('badge');

    expect(badge).toHaveAttribute('aria-label', 'Total');
    expect(badge).toHaveClass('custom');
  });
});
