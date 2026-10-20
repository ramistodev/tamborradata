import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { TerminalLine } from '@/app/(frontend)/[locale]/(landing)/components/open-source/TerminalLine';

describe('TerminalLine', () => {
  it('renders a command with a decorative dollar prompt', () => {
    const { container } = render(<TerminalLine kind="command" text="pnpm install" />);

    const prefix = container.querySelector('[aria-hidden="true"]');

    expect(screen.getByText('pnpm install', { exact: false })).toBeInTheDocument();
    expect(prefix).toHaveTextContent('$');
  });

  it('renders an output with a decorative one character mark that is not the prompt', () => {
    const { container } = render(<TerminalLine kind="output" text="Ready on http://localhost:3000" />);

    const prefix = container.querySelector('[aria-hidden="true"]');

    expect(screen.getByText('Ready on http://localhost:3000', { exact: false })).toBeInTheDocument();
    expect(prefix?.textContent).toHaveLength(1);
    expect(prefix?.textContent).not.toBe('$');
  });
});
