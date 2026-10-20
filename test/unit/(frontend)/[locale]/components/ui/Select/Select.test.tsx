import { createRef } from 'react';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Select } from '@/app/(frontend)/[locale]/components/ui/Select/Select';

const options = [
  { value: 'a', label: 'Alpha' },
  { value: 'b', label: 'Beta', disabled: true },
  { value: 'c', label: 'Gamma' },
  { value: 'd', label: 'Árbol' },
];

function getTrigger() {
  return screen.getByRole('combobox', { name: 'Colegio' });
}

describe('Select (not searchable)', () => {
  const baseProps = { options, ariaLabel: 'Colegio', placeholder: 'Pick' };

  it('renders a closed combobox trigger with the placeholder', () => {
    render(<Select {...baseProps} />);

    const trigger = getTrigger();

    expect(trigger).toHaveAttribute('aria-haspopup', 'listbox');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(trigger).toHaveTextContent('Pick');
    expect(screen.queryByRole('listbox')).toBeNull();
  });

  it('opens a listbox with every option on click', async () => {
    const user = userEvent.setup();
    render(<Select {...baseProps} />);

    await user.click(getTrigger());

    const listbox = screen.getByRole('listbox');

    expect(getTrigger()).toHaveAttribute('aria-expanded', 'true');
    expect(getTrigger()).toHaveAttribute('aria-controls', listbox.id);
    expect(within(listbox).getAllByRole('option')).toHaveLength(4);
    expect(screen.getByRole('option', { name: 'Beta' })).toHaveAttribute('aria-disabled', 'true');
  });

  it('selects an option on click, reports it and closes the list', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Select {...baseProps} onChange={onChange} />);

    await user.click(getTrigger());
    await user.click(screen.getByRole('option', { name: 'Gamma' }));

    expect(onChange).toHaveBeenCalledWith('c');
    expect(getTrigger()).toHaveTextContent('Gamma');
    expect(getTrigger()).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByRole('listbox')).toBeNull();
  });

  it('ignores a click on a disabled option', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Select {...baseProps} onChange={onChange} />);

    await user.click(getTrigger());
    await user.click(screen.getByRole('option', { name: 'Beta' }));

    expect(onChange).not.toHaveBeenCalled();
    expect(screen.getByRole('listbox')).toBeInTheDocument();
  });

  it('shows and marks the controlled value', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Select {...baseProps} value="c" onChange={onChange} />);

    await user.click(getTrigger());

    expect(getTrigger()).toHaveTextContent('Gamma');
    expect(screen.getByRole('option', { name: 'Gamma' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('option', { name: 'Alpha' })).toHaveAttribute('aria-selected', 'false');
  });

  it('keeps showing the controlled value after a selection until the parent changes it', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Select {...baseProps} value="c" onChange={onChange} />);

    await user.click(getTrigger());
    await user.click(screen.getByRole('option', { name: 'Alpha' }));

    expect(onChange).toHaveBeenCalledWith('a');
    expect(getTrigger()).toHaveTextContent('Gamma');
  });

  it('starts from the default value when uncontrolled and updates after a selection', async () => {
    const user = userEvent.setup();
    render(<Select {...baseProps} defaultValue="a" />);

    expect(getTrigger()).toHaveTextContent('Alpha');

    await user.click(getTrigger());
    await user.click(screen.getByRole('option', { name: 'Gamma' }));

    expect(getTrigger()).toHaveTextContent('Gamma');
  });

  it('opens with the keyboard, skips disabled options and selects with Enter', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Select {...baseProps} onChange={onChange} />);

    getTrigger().focus();
    await user.keyboard('{ArrowDown}');

    expect(getTrigger()).toHaveAttribute('aria-expanded', 'true');
    expect(getTrigger()).toHaveAttribute('aria-activedescendant', screen.getByRole('option', { name: 'Alpha' }).id);

    await user.keyboard('{ArrowDown}');

    expect(getTrigger()).toHaveAttribute('aria-activedescendant', screen.getByRole('option', { name: 'Gamma' }).id);

    await user.keyboard('{Enter}');

    expect(onChange).toHaveBeenCalledWith('c');
    expect(getTrigger()).toHaveAttribute('aria-expanded', 'false');
  });

  it('closes with Escape and returns the focus to the trigger', async () => {
    const user = userEvent.setup();
    render(<Select {...baseProps} />);

    getTrigger().focus();
    await user.keyboard('{ArrowDown}');
    await user.keyboard('{Escape}');

    expect(getTrigger()).toHaveAttribute('aria-expanded', 'false');
    expect(getTrigger()).toHaveFocus();
  });

  it('disables the trigger', () => {
    render(<Select {...baseProps} disabled />);

    expect(getTrigger()).toBeDisabled();
  });

  it('shows six loading rows in a busy listbox', async () => {
    const user = userEvent.setup();
    render(<Select {...baseProps} isLoading />);

    await user.click(getTrigger());

    expect(screen.getByRole('listbox')).toHaveAttribute('aria-busy', 'true');
    expect(screen.getAllByRole('presentation')).toHaveLength(6);
  });

  it('mirrors the selected value in a named hidden input', () => {
    const { container } = render(<Select {...baseProps} name="school" defaultValue="c" />);

    expect(container.querySelector('input[name="school"]')).toHaveValue('c');
  });

  it('marks the trigger as required', () => {
    render(<Select {...baseProps} required />);

    expect(getTrigger()).toHaveAttribute('aria-required', 'true');
  });

  it('shows the visible label and uses it as the trigger name', () => {
    render(<Select options={options} placeholder="Pick" label="Escuela" />);

    expect(screen.getByText('Escuela')).toBeVisible();
    expect(screen.getByRole('combobox', { name: 'Escuela' })).toBeInTheDocument();
  });

  it('shows the empty message when there are no options', async () => {
    const user = userEvent.setup();
    render(<Select {...baseProps} options={[]} emptyMessage="Nothing here" />);

    await user.click(getTrigger());

    expect(screen.getByText('Nothing here')).toBeInTheDocument();
    expect(screen.queryByRole('listbox')).toBeNull();
  });

  it('hands the trigger button to the ref', () => {
    const ref = createRef<HTMLButtonElement>();
    render(<Select {...baseProps} ref={ref} />);

    expect(ref.current).toBe(getTrigger());
  });
});

describe('Select (searchable)', () => {
  const searchProps = {
    options,
    ariaLabel: 'Colegio',
    placeholder: 'Pick',
    searchable: true,
    searchPlaceholder: 'Buscar...',
    searchLabel: 'Buscar colegio',
    emptyMessage: 'Ninguno',
    getResultsMessage: (count: number) => `${count} found`,
  };

  function getSearchTrigger() {
    return screen.getByRole('button', { name: 'Colegio' });
  }

  it('renders a plain popup button instead of a combobox trigger', () => {
    render(<Select {...searchProps} />);

    expect(screen.queryByRole('combobox')).toBeNull();
    expect(getSearchTrigger()).toHaveAttribute('aria-haspopup', 'dialog');
  });

  it('opens a dialog with a focused search combobox', async () => {
    const user = userEvent.setup();
    render(<Select {...searchProps} />);

    await user.click(getSearchTrigger());

    const dialog = screen.getByRole('dialog', { name: 'Colegio' });
    const search = within(dialog).getByRole('combobox', { name: 'Buscar colegio' });

    expect(search).toHaveFocus();
  });

  it('filters ignoring accents and announces the result count', async () => {
    const user = userEvent.setup();
    render(<Select {...searchProps} />);

    await user.click(getSearchTrigger());
    await user.type(screen.getByRole('combobox', { name: 'Buscar colegio' }), 'arb');

    expect(screen.getAllByRole('option')).toHaveLength(1);
    expect(screen.getByRole('option', { name: 'Árbol' })).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent('1 found');
  });

  it('shows and announces the empty message when nothing matches', async () => {
    const user = userEvent.setup();
    render(<Select {...searchProps} />);

    await user.click(getSearchTrigger());
    await user.type(screen.getByRole('combobox', { name: 'Buscar colegio' }), 'zzz');

    expect(screen.queryAllByRole('option')).toHaveLength(0);
    expect(screen.getByRole('status')).toHaveTextContent('Ninguno');
    expect(within(screen.getByRole('dialog')).getByText('Ninguno')).toBeInTheDocument();
  });

  it('selects by click, reports it and closes', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Select {...searchProps} onChange={onChange} />);

    await user.click(getSearchTrigger());
    await user.click(screen.getByRole('option', { name: 'Gamma' }));

    expect(onChange).toHaveBeenCalledWith('c');
    expect(screen.queryByRole('dialog')).toBeNull();
    // Once a value is chosen, the trigger name is the label followed by that value
    expect(screen.getByRole('button', { name: 'Colegio Gamma' })).toHaveAttribute('aria-expanded', 'false');
  });

  it('closes with Escape inside the search field and focuses the trigger', async () => {
    const user = userEvent.setup();
    render(<Select {...searchProps} />);

    await user.click(getSearchTrigger());
    await user.keyboard('{Escape}');

    expect(screen.queryByRole('dialog')).toBeNull();
    expect(getSearchTrigger()).toHaveFocus();
  });

  it('closes when the user presses the mouse outside', async () => {
    const user = userEvent.setup();
    render(<Select {...searchProps} />);

    await user.click(getSearchTrigger());
    await user.click(document.body);

    expect(screen.queryByRole('dialog')).toBeNull();
    expect(getSearchTrigger()).toHaveAttribute('aria-expanded', 'false');
  });

  it('moves the focus to the element returned by getFocusAfterSelect', async () => {
    const user = userEvent.setup();
    render(
      <>
        <button type="button">Next field</button>
        <Select
          {...searchProps}
          getFocusAfterSelect={() => screen.getByRole('button', { name: 'Next field' })}
        />
      </>,
    );

    await user.click(getSearchTrigger());
    await user.click(screen.getByRole('option', { name: 'Gamma' }));

    expect(screen.getByRole('button', { name: 'Next field' })).toHaveFocus();
  });
});
