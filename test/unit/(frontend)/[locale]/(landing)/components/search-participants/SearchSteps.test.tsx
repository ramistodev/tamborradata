import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { SearchSteps } from '@/app/(frontend)/[locale]/(landing)/components/search-participants/SearchSteps';

describe('SearchSteps', () => {
  const steps = [
    { title: 'T1', description: 'D1' },
    { title: 'T2', description: 'D2' },
  ];

  it('renders an ordered list with one item per step', () => {
    const { container } = render(<SearchSteps steps={steps} />);

    expect(container.querySelector('ol')).not.toBeNull();
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
  });

  it('renders the title and description of each step', () => {
    render(<SearchSteps steps={steps} />);

    const [first, second] = screen.getAllByRole('listitem');

    expect(within(first).getByText('T1')).toBeInTheDocument();
    expect(within(first).getByText('D1')).toBeInTheDocument();
    expect(within(second).getByText('T2')).toBeInTheDocument();
    expect(within(second).getByText('D2')).toBeInTheDocument();
  });

  it('numbers the steps in decorative badges', () => {
    render(<SearchSteps steps={steps} />);

    expect(screen.getByText('1')).toHaveAttribute('aria-hidden', 'true');
    expect(screen.getByText('2')).toHaveAttribute('aria-hidden', 'true');
  });

  it('renders an empty list without steps', () => {
    const { container } = render(<SearchSteps steps={[]} />);

    expect(container.querySelector('ol')).toBeEmptyDOMElement();
  });
});
