import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Button, buttonStyles } from '@/app/(frontend)/[locale]/components/ui/Button';

describe('Button', () => {
  it('renders a button of type button by default', () => {
    render(<Button>Save</Button>);

    expect(screen.getByRole('button', { name: 'Save' })).toHaveAttribute('type', 'button');
  });

  it('renders a submit button when type is submit', () => {
    render(<Button type="submit">Save</Button>);

    expect(screen.getByRole('button', { name: 'Save' })).toHaveAttribute('type', 'submit');
  });

  it('calls onClick once per click', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Save</Button>);

    await user.click(screen.getByRole('button', { name: 'Save' }));

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('is disabled and ignores clicks when disabled', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <Button disabled onClick={onClick}>
        Save
      </Button>,
    );

    const button = screen.getByRole('button', { name: 'Save' });
    await user.click(button);

    expect(button).toBeDisabled();
    expect(onClick).not.toHaveBeenCalled();
  });

  it('passes aria-disabled through', () => {
    render(<Button aria-disabled="true">Save</Button>);

    expect(screen.getByRole('button', { name: 'Save' })).toHaveAttribute('aria-disabled', 'true');
  });

  it('builds its class name with buttonStyles', () => {
    render(
      <Button variant="ghost" size="sm" className="extra">
        Save
      </Button>,
    );

    expect(screen.getByRole('button', { name: 'Save' }).className).toBe(
      buttonStyles({ variant: 'ghost', size: 'sm', className: 'extra' }),
    );
  });
});

describe('buttonStyles', () => {
  it('defaults to the primary variant and the md size', () => {
    const styles = buttonStyles();

    expect(styles).toContain('inline-flex');
    expect(styles).toContain('bg-accent');
    expect(styles).toContain('px-[21px]');
  });

  it.each([
    ['danger', 'text-text-danger'],
    ['warning', 'text-text-warning'],
    ['success', 'text-text-success'],
  ] as const)('applies the %s variant colors', (variant, expectedClass) => {
    expect(buttonStyles({ variant })).toContain(expectedClass);
  });

  it('applies the sm size padding', () => {
    expect(buttonStyles({ size: 'sm' })).toContain('px-[14px]');
  });

  it('appends the className at the end', () => {
    expect(buttonStyles({ className: 'extra' }).endsWith(' extra')).toBe(true);
  });
});
