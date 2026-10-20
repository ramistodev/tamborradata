import { createRef, useState } from 'react';
import type { FormEvent, RefObject } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { screen, within } from '@testing-library/react';
import { createTranslator } from 'next-intl';
import { SearchForm } from '@/app/(frontend)/[locale]/(pages)/search-participants/components/SearchForm';
import { messagesByLocale } from '@/test/helpers/messages';
import { renderWithIntl } from '@/test/helpers/renderWithIntl';

const m = messagesByLocale.es;
const form = m.Search.form;
const t = createTranslator({ locale: 'es', messages: m, namespace: 'Search.form' } as never);

const defaultOptions = [
  { value: 's1', label: 'Escuela Uno' },
  { value: 's2', label: 'Escuela Dos' },
];

type HarnessProps = {
  schoolOptions?: { value: string; label: string }[];
  isNameValid?: boolean;
  canSubmit?: boolean;
  isSearching?: boolean;
  onNameChange?: (name: string) => void;
  onSchoolChange?: (schoolKey: string) => void;
  handleSubmit?: (event: FormEvent) => void;
  nameInputRef?: RefObject<HTMLInputElement | null>;
  schoolDropdownRef?: RefObject<HTMLButtonElement | null>;
};

function Harness({
  schoolOptions = defaultOptions,
  isNameValid = true,
  canSubmit = true,
  isSearching = false,
  onNameChange = vi.fn(),
  onSchoolChange = vi.fn(),
  handleSubmit = vi.fn((event: FormEvent) => event.preventDefault()),
  nameInputRef = createRef<HTMLInputElement>(),
  schoolDropdownRef = createRef<HTMLButtonElement>(),
}: HarnessProps) {
  const [name, setName] = useState('');
  const [schoolKey, setSchoolKey] = useState<string | null>(null);

  return (
    <SearchForm
      name={name}
      onNameChange={(value) => {
        onNameChange(value);
        setName(value);
      }}
      nameInputRef={nameInputRef}
      schoolDropdownRef={schoolDropdownRef}
      schoolKey={schoolKey}
      onSchoolChange={(value) => {
        onSchoolChange(value);
        setSchoolKey(value);
      }}
      schoolOptions={schoolOptions}
      isNameValid={isNameValid}
      canSubmit={canSubmit}
      isSearching={isSearching}
      handleSubmit={handleSubmit}
    />
  );
}

function nameInput(): HTMLElement {
  return screen.getByRole('textbox', { name: form.name.ariaLabel });
}

function schoolTrigger(): HTMLElement {
  return screen.getByRole('button', { name: form.school.ariaLabel });
}

function submitButton(): HTMLElement {
  return screen.getByRole('button', { name: form.submit });
}

describe('SearchForm', () => {
  describe('structure', () => {
    it('renders a search form with its accessible name', () => {
      renderWithIntl(<Harness />);

      expect(screen.getByRole('search', { name: form.ariaLabel })).toBeInTheDocument();
    });

    it('renders the name input with its attributes and hint', () => {
      renderWithIntl(<Harness />);

      const input = nameInput();
      expect(input).toHaveAttribute('placeholder', form.name.placeholder);
      expect(input).toHaveAttribute('maxlength', '120');
      expect(input).toHaveAttribute('aria-required', 'true');
      const hint = document.getElementById(input.getAttribute('aria-describedby') ?? '');
      expect(hint).toHaveTextContent(form.hint);
      expect(hint?.tagName).toBe('P');
    });

    it('renders the school trigger as a dialog popup button', () => {
      renderWithIntl(<Harness />);

      expect(schoolTrigger()).toHaveAttribute('aria-haspopup', 'dialog');
    });
  });

  describe('name input', () => {
    it('calls onNameChange with the new value on every keystroke', async () => {
      const onNameChange = vi.fn();
      const { user } = renderWithIntl(<Harness onNameChange={onNameChange} />);

      await user.type(nameInput(), 'Ane');

      expect(onNameChange.mock.calls).toEqual([['A'], ['An'], ['Ane']]);
      expect(nameInput()).toHaveValue('Ane');
    });
  });

  describe('school select', () => {
    it('opens a dialog with a named combobox and one option per school', async () => {
      const { user } = renderWithIntl(<Harness />);

      await user.click(schoolTrigger());

      const dialog = screen.getByRole('dialog');
      expect(within(dialog).getByRole('combobox', { name: form.school.searchAriaLabel })).toBeInTheDocument();
      expect(within(dialog).getAllByRole('option')).toHaveLength(2);
    });

    it('calls onSchoolChange with the chosen school key', async () => {
      const onSchoolChange = vi.fn();
      const { user } = renderWithIntl(<Harness onSchoolChange={onSchoolChange} />);

      await user.click(schoolTrigger());
      await user.click(screen.getByRole('option', { name: 'Escuela Dos' }));

      expect(onSchoolChange).toHaveBeenCalledWith('s2');
    });

    it('moves focus to the submit button after choosing when the name is valid', async () => {
      const { user } = renderWithIntl(<Harness isNameValid />);

      await user.click(schoolTrigger());
      await user.click(screen.getByRole('option', { name: 'Escuela Dos' }));

      expect(submitButton()).toHaveFocus();
    });

    it('moves focus to the name input after choosing when the name is not valid', async () => {
      const { user } = renderWithIntl(<Harness isNameValid={false} />);

      await user.click(schoolTrigger());
      await user.click(screen.getByRole('option', { name: 'Escuela Dos' }));

      expect(nameInput()).toHaveFocus();
    });

    it('shows the empty message when there are no schools', async () => {
      const { user } = renderWithIntl(<Harness schoolOptions={[]} />);

      await user.click(schoolTrigger());

      expect(screen.getByText(form.school.empty)).toBeInTheDocument();
    });

    it('announces how many schools match the filter', async () => {
      const { user } = renderWithIntl(<Harness />);

      await user.click(schoolTrigger());
      await user.type(screen.getByRole('combobox', { name: form.school.searchAriaLabel }), 'dos');

      const status = screen.getByRole('status');
      expect(status).toHaveTextContent(t('school.resultsCount', { count: 1 }));
      expect(screen.getAllByRole('option')).toHaveLength(1);
    });
  });

  describe('submit button', () => {
    it('is aria-disabled when the form cannot be submitted', () => {
      renderWithIntl(<Harness canSubmit={false} />);

      expect(submitButton()).toHaveAttribute('aria-disabled', 'true');
    });

    it('is aria-disabled while a search is running', () => {
      renderWithIntl(<Harness isSearching />);

      expect(submitButton()).toHaveAttribute('aria-disabled', 'true');
    });

    it('is not aria-disabled when the form can be submitted', () => {
      renderWithIntl(<Harness canSubmit isSearching={false} />);

      expect(submitButton()).toHaveAttribute('aria-disabled', 'false');
    });

    it('calls handleSubmit on click even when aria-disabled, because it is not natively disabled', async () => {
      const handleSubmit = vi.fn((event: FormEvent) => event.preventDefault());
      const { user } = renderWithIntl(<Harness canSubmit={false} handleSubmit={handleSubmit} />);

      await user.click(submitButton());

      expect(submitButton()).toBeEnabled();
      expect(handleSubmit).toHaveBeenCalledTimes(1);
    });

    it('calls handleSubmit when pressing Enter in the name input', async () => {
      const handleSubmit = vi.fn((event: FormEvent) => event.preventDefault());
      const { user } = renderWithIntl(<Harness handleSubmit={handleSubmit} />);

      await user.type(nameInput(), 'Ane{Enter}');

      expect(handleSubmit).toHaveBeenCalledTimes(1);
    });
  });

  describe('refs', () => {
    it('hands the name input and the school trigger to the parent refs', () => {
      const nameInputRef = createRef<HTMLInputElement>();
      const schoolDropdownRef = createRef<HTMLButtonElement>();
      renderWithIntl(<Harness nameInputRef={nameInputRef} schoolDropdownRef={schoolDropdownRef} />);

      expect(nameInputRef.current).toBe(nameInput());
      expect(schoolDropdownRef.current).toBe(schoolTrigger());
    });
  });
});
