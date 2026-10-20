import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Card } from '@/app/(frontend)/[locale]/components/ui/Card';

describe('Card', () => {
  it('renders a section with its children', () => {
    render(
      <Card aria-label="Box">
        <p>content</p>
      </Card>,
    );

    expect(screen.getByRole('region', { name: 'Box' }).tagName).toBe('SECTION');
    expect(screen.getByText('content')).toBeInTheDocument();
  });

  it('renders the title as a level 3 heading by default', () => {
    render(<Card title="Title" />);

    expect(screen.getByRole('heading', { name: 'Title', level: 3 })).toBeInTheDocument();
  });

  it('renders the title with the requested heading level', () => {
    render(<Card title="Title" headingAs="h2" />);

    expect(screen.getByRole('heading', { name: 'Title', level: 2 })).toBeInTheDocument();
  });

  it('renders the description in a paragraph', () => {
    render(<Card title="Title" description="About this card" />);

    expect(screen.getByText('About this card').tagName).toBe('P');
  });

  it('renders the action inside the header next to the title', () => {
    const { container } = render(<Card title="Title" action={<button type="button">Filter</button>} />);

    const header = container.querySelector('header');
    const action = screen.getByRole('button', { name: 'Filter' });

    expect(header).toContainElement(action);
    expect(header).toContainElement(screen.getByRole('heading', { name: 'Title' }));
  });

  it('renders a header when there is only an action', () => {
    const { container } = render(<Card action={<button type="button">Filter</button>} />);

    expect(container.querySelector('header')).not.toBeNull();
  });

  it('renders no header without title and action', () => {
    const { container } = render(<Card description="Only text" />);

    expect(container.querySelector('header')).toBeNull();
  });

  it('adds the accent border for the accent tone', () => {
    render(<Card tone="accent" aria-label="Box" />);

    expect(screen.getByRole('region', { name: 'Box' })).toHaveClass('border-accent');
  });

  it('forwards extra props and the className', () => {
    render(<Card aria-label="Box" className="custom" />);

    expect(screen.getByRole('region', { name: 'Box' })).toHaveClass('custom');
  });
});
