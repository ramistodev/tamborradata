import { createRef, useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { fieldBorderStyles, fieldStyles, Input } from '@/app/(frontend)/[locale]/components/ui/Input';

function Controlled({ onChange }: { onChange: (value: string) => void }) {
  const [value, setValue] = useState('');

  return (
    <Input
      aria-label="Name"
      value={value}
      onChange={(event) => {
        setValue(event.target.value);
        onChange(event.target.value);
      }}
    />
  );
}

describe('Input', () => {
  it('renders a textbox', () => {
    render(<Input aria-label="Name" />);

    expect(screen.getByRole('textbox', { name: 'Name' })).toBeInTheDocument();
  });

  it('shows the typed value and fires onChange per character', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Controlled onChange={onChange} />);

    const input = screen.getByRole('textbox', { name: 'Name' });
    await user.type(input, 'Ane');

    expect(input).toHaveValue('Ane');
    expect(onChange.mock.calls).toEqual([['A'], ['An'], ['Ane']]);
  });

  it('forwards placeholder, aria attributes, maxLength and disabled', () => {
    render(<Input aria-label="Name" placeholder="Type here" aria-invalid="true" maxLength={5} disabled />);

    const input = screen.getByRole('textbox', { name: 'Name' });

    expect(input).toHaveAttribute('placeholder', 'Type here');
    expect(input).toBeInvalid();
    expect(input).toHaveAttribute('maxlength', '5');
    expect(input).toBeDisabled();
  });

  it('appends the className after the base classes', () => {
    render(<Input aria-label="Name" className="custom" />);

    const input = screen.getByRole('textbox', { name: 'Name' });

    expect(input).toHaveClass('custom');
    expect(input.className.endsWith(' custom')).toBe(true);
    expect(input.className.startsWith(fieldStyles)).toBe(true);
  });

  it('forwards a ref to the input element', () => {
    const ref = createRef<HTMLInputElement>();
    render(<Input aria-label="Name" ref={ref} />);

    expect(ref.current).toBe(screen.getByRole('textbox', { name: 'Name' }));
  });
});

describe('field styles', () => {
  it.each([
    ['fieldStyles', fieldStyles],
    ['fieldBorderStyles', fieldBorderStyles],
  ])('%s is a non-empty string', (_name, styles) => {
    expect(typeof styles).toBe('string');
    expect(styles.length).toBeGreaterThan(0);
  });
});
