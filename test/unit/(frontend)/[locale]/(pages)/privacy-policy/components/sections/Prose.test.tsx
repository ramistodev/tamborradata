import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { P, Ul, rich } from '@/app/(frontend)/[locale]/(pages)/privacy-policy/components/sections/Prose';

describe('Prose', () => {
  describe('P', () => {
    it('renders a paragraph with its children', () => {
      const { container } = render(<P>hello</P>);

      expect(container.querySelector('p')).toHaveTextContent('hello');
    });
  });

  describe('Ul', () => {
    it('renders a list with its children', () => {
      render(
        <Ul>
          <li>one</li>
          <li>two</li>
        </Ul>,
      );

      const list = screen.getByRole('list');
      expect(list.tagName).toBe('UL');
      expect(screen.getAllByRole('listitem')).toHaveLength(2);
    });
  });

  describe('rich', () => {
    it('renders strong text', () => {
      const { container } = render(<>{rich.strong('x')}</>);

      expect(container.querySelector('strong')).toHaveTextContent('x');
    });

    it('renders inline code', () => {
      const { container } = render(<>{rich.code('x')}</>);

      expect(container.querySelector('code')).toHaveTextContent('x');
    });

    it('renders a mailto link to the contact address', () => {
      render(<>{rich.mail('write')}</>);

      expect(screen.getByRole('link', { name: 'write' })).toHaveAttribute(
        'href',
        'mailto:contact@tamborradata.com',
      );
    });

    it('exposes the contact email as a value', () => {
      expect(rich.email).toBe('contact@tamborradata.com');
    });
  });
});
