import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { SectionLayout } from '@/app/(frontend)/[locale]/(pages)/privacy-policy/components/SectionLayout';

describe('SectionLayout', () => {
  it('renders a focusable section labelled by its title', () => {
    render(
      <SectionLayout id="rights" index={4} title="Rights">
        <p>body</p>
      </SectionLayout>,
    );

    const section = screen.getByRole('region', { name: 'Rights' });
    expect(section.tagName).toBe('SECTION');
    expect(section).toHaveAttribute('id', 'rights');
    expect(section).toHaveAttribute('tabindex', '-1');
    expect(section).toHaveAttribute('aria-labelledby', 'rights-title');
  });

  it('renders the title heading with the labelledby id and the padded index', () => {
    const { container } = render(
      <SectionLayout id="rights" index={4} title="Rights">
        <p>body</p>
      </SectionLayout>,
    );

    expect(screen.getByRole('heading', { level: 2, name: 'Rights' })).toHaveAttribute('id', 'rights-title');
    expect(container.querySelector('span[aria-hidden="true"]')).toHaveTextContent('04/');
  });

  it('renders the children inside the section', () => {
    render(
      <SectionLayout id="rights" index={4} title="Rights">
        <p>body</p>
      </SectionLayout>,
    );

    expect(screen.getByRole('region', { name: 'Rights' })).toContainElement(screen.getByText('body'));
  });
});
