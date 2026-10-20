import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Container } from '@/app/(frontend)/[locale]/components/ui/Container';

describe('Container', () => {
  it('renders its children', () => {
    render(
      <Container>
        <p>child</p>
      </Container>,
    );

    expect(screen.getByText('child')).toBeInTheDocument();
  });

  it('centers the content to the site max width', () => {
    render(<Container data-testid="container" />);

    const container = screen.getByTestId('container');

    expect(container).toHaveClass('mx-auto');
    expect(container).toHaveClass('max-w-275');
  });

  it('forwards the className and extra props', () => {
    render(<Container data-testid="container" className="custom" />);

    expect(screen.getByTestId('container')).toHaveClass('custom');
  });
});
