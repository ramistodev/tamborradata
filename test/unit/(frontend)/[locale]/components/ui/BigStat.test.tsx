import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { BigStat, StatHighlight } from '@/app/(frontend)/[locale]/components/ui/BigStat';

describe('BigStat', () => {
  it('renders the value first and the children second, in two paragraphs', () => {
    const { container } = render(<BigStat value="1.234">participants</BigStat>);

    const paragraphs = container.querySelectorAll('p');

    expect(paragraphs).toHaveLength(2);
    expect(paragraphs[0]).toHaveTextContent('1.234');
    expect(paragraphs[1]).toHaveTextContent('participants');
  });

  it('applies the className to the wrapper', () => {
    const { container } = render(
      <BigStat value="1" className="custom">
        x
      </BigStat>,
    );

    expect(container.firstElementChild).toHaveClass('custom');
  });
});

describe('StatHighlight', () => {
  it('renders its children in a bold span', () => {
    render(<StatHighlight>highlight</StatHighlight>);

    const node = screen.getByText('highlight');

    expect(node.tagName).toBe('SPAN');
    expect(node).toHaveClass('font-bold');
  });
});
