import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { TerminalWindow } from '@/app/(frontend)/[locale]/(landing)/components/open-source/TerminalWindow';

describe('TerminalWindow', () => {
  it('renders the title and the children', () => {
    render(
      <TerminalWindow title="my/repo">
        <p>line one</p>
      </TerminalWindow>,
    );

    expect(screen.getByText('my/repo')).toBeInTheDocument();
    expect(screen.getByText('line one')).toBeInTheDocument();
  });

  it('draws three decorative dots inside an aria-hidden container', () => {
    const { container } = render(
      <TerminalWindow title="my/repo">
        <p>line one</p>
      </TerminalWindow>,
    );

    const dots = container.querySelector('[aria-hidden="true"]');

    expect(dots).not.toBeNull();
    expect(dots?.children).toHaveLength(3);
  });
});
