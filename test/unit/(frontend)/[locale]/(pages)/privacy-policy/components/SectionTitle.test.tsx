import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { SectionTitle } from '@/app/(frontend)/[locale]/(pages)/privacy-policy/components/SectionTitle';

describe('SectionTitle', () => {
  it.each([
    [1, '01'],
    [12, '12'],
  ])('shows index %s as %s in an aria-hidden span next to a slash', (index, label) => {
    const { container } = render(<SectionTitle id="x-title" index={index} title="Title" />);

    const marker = container.querySelector('span[aria-hidden="true"]');
    expect(marker).not.toBeNull();
    expect(marker).toHaveTextContent(`${label}/`);
    expect(marker?.querySelectorAll('span')[0]).toHaveTextContent(label);
    expect(marker?.querySelectorAll('span')[1]).toHaveTextContent('/');
  });

  it('renders the title in an h2 with the given id', () => {
    render(<SectionTitle id="x-title" index={3} title="My title" />);

    const heading = screen.getByRole('heading', { level: 2, name: 'My title' });
    expect(heading).toHaveAttribute('id', 'x-title');
  });
});
