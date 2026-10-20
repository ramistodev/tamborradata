import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { FAQs } from '@/app/(frontend)/[locale]/components/ui/FAQs';

const items = [
  { question: 'Q1', answer: 'A1' },
  { question: 'Q2', answer: 'A2' },
];

describe('FAQs', () => {
  it('renders one collapsed button per question', () => {
    render(<FAQs items={items} />);

    expect(screen.getByRole('button', { name: 'Q1' })).toHaveAttribute('aria-expanded', 'false');
    expect(screen.getByRole('button', { name: 'Q2' })).toHaveAttribute('aria-expanded', 'false');
  });

  it('renders the questions as level 3 headings by default', () => {
    render(<FAQs items={items} />);

    expect(screen.getAllByRole('heading', { level: 3 })).toHaveLength(2);
  });

  it('renders the questions with the requested heading level', () => {
    render(<FAQs items={items} headingLevel="h2" />);

    expect(screen.getAllByRole('heading', { level: 2 })).toHaveLength(2);
    expect(screen.queryAllByRole('heading', { level: 3 })).toHaveLength(0);
  });

  it('keeps the answers in the DOM while closed', () => {
    render(<FAQs items={items} />);

    expect(screen.getByText('A1')).toBeInTheDocument();
    expect(screen.getByText('A2')).toBeInTheDocument();
  });

  it('opens a question on click and points aria-controls to the panel with the answer', async () => {
    const user = userEvent.setup();
    render(<FAQs items={items} />);

    const button = screen.getByRole('button', { name: 'Q1' });
    await user.click(button);

    const panel = document.getElementById(button.getAttribute('aria-controls') ?? '');

    expect(button).toHaveAttribute('aria-expanded', 'true');
    expect(panel).not.toBeNull();
    expect(panel).toContainElement(screen.getByText('A1'));
  });

  it('closes an open question on a second click', async () => {
    const user = userEvent.setup();
    render(<FAQs items={items} />);

    const button = screen.getByRole('button', { name: 'Q1' });
    await user.click(button);
    await user.click(button);

    expect(button).toHaveAttribute('aria-expanded', 'false');
  });

  it('does not open the other questions', async () => {
    const user = userEvent.setup();
    render(<FAQs items={items} />);

    await user.click(screen.getByRole('button', { name: 'Q1' }));

    expect(screen.getByRole('button', { name: 'Q2' })).toHaveAttribute('aria-expanded', 'false');
  });

  it.each([
    ['Enter', '{Enter}'],
    ['Space', ' '],
  ])('toggles the first question with the %s key', async (_name, key) => {
    const user = userEvent.setup();
    render(<FAQs items={items} />);

    await user.tab();
    await user.keyboard(key);

    expect(screen.getByRole('button', { name: 'Q1' })).toHaveAttribute('aria-expanded', 'true');
  });

  it('gives every question button a different id', () => {
    render(<FAQs items={items} />);

    const first = screen.getByRole('button', { name: 'Q1' }).id;
    const second = screen.getByRole('button', { name: 'Q2' }).id;

    expect(first).not.toBe('');
    expect(first).not.toBe(second);
  });

  it('applies the className to the wrapper', () => {
    const { container } = render(<FAQs items={items} className="custom" />);

    expect(container.firstElementChild).toHaveClass('custom');
  });

  it('renders only the wrapper when there are no items', () => {
    const { container } = render(<FAQs items={[]} />);

    expect(container.firstElementChild).toBeEmptyDOMElement();
  });
});
