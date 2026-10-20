import { describe, expect, it } from 'vitest';
import { screen } from '@testing-library/react';
import { StatusPanel } from '@/app/(frontend)/[locale]/(pages)/search-participants/components/status/StatusPanel';
import { renderWithIntl } from '@/test/helpers/renderWithIntl';

function root(container: HTMLElement): HTMLElement {
  return container.firstElementChild as HTMLElement;
}

describe('StatusPanel', () => {
  it('renders the icon inside an aria-hidden container', () => {
    renderWithIntl(
      <StatusPanel icon={<svg data-testid="icon" />} title="Title">
        Body
      </StatusPanel>,
    );

    expect(screen.getByTestId('icon').closest('[aria-hidden="true"]')).not.toBeNull();
  });

  it('renders the title as a level 3 heading', () => {
    renderWithIntl(
      <StatusPanel icon={null} title="Panel title">
        Body
      </StatusPanel>,
    );

    expect(screen.getByRole('heading', { level: 3, name: 'Panel title' })).toBeInTheDocument();
  });

  it('renders the children inside a paragraph', () => {
    renderWithIntl(
      <StatusPanel icon={null} title="Title">
        Panel description
      </StatusPanel>,
    );

    expect(screen.getByText('Panel description').tagName).toBe('P');
  });

  it('renders the action only when provided', () => {
    const { rerender } = renderWithIntl(
      <StatusPanel icon={null} title="Title">
        Body
      </StatusPanel>,
    );

    expect(screen.queryByRole('button')).not.toBeInTheDocument();

    rerender(
      <StatusPanel icon={null} title="Title" action={<button type="button">Do it</button>}>
        Body
      </StatusPanel>,
    );

    expect(screen.getByRole('button', { name: 'Do it' })).toBeInTheDocument();
  });

  it('uses the neutral border and card background by default', () => {
    const { container } = renderWithIntl(
      <StatusPanel icon={null} title="Title">
        Body
      </StatusPanel>,
    );

    expect(root(container)).toHaveClass('border-border', 'bg-card');
  });

  it('applies the danger border with the danger tone', () => {
    const { container } = renderWithIntl(
      <StatusPanel icon={null} title="Title" tone="danger">
        Body
      </StatusPanel>,
    );

    expect(root(container)).toHaveClass('border-border-danger');
  });

  it('applies the warning border with the warning tone', () => {
    const { container } = renderWithIntl(
      <StatusPanel icon={null} title="Title" tone="warning">
        Body
      </StatusPanel>,
    );

    expect(root(container)).toHaveClass('border-border-warning');
  });
});
