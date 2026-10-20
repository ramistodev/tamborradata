import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { MockIntersectionObserver } from '@/test/helpers/observers';
import { renderWithIntl } from '@/test/helpers/renderWithIntl';

describe('jsdom environment', () => {
  it('renders a component and jest-dom matchers work', () => {
    renderWithIntl(<button>ok</button>);

    expect(document.body).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'ok' })).toBeVisible();
  });

  it('installs the browser stubs jsdom lacks', () => {
    expect(window.matchMedia('(prefers-reduced-motion: reduce)').matches).toBe(false);
    expect(new IntersectionObserver(() => {})).toBeInstanceOf(MockIntersectionObserver);
    expect(typeof window.ResizeObserver).toBe('function');
    expect(typeof Element.prototype.scrollIntoView).toBe('function');
    expect(typeof window.scrollTo).toBe('function');
  });
});
