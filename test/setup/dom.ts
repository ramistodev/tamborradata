import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, beforeEach, vi } from 'vitest';
import { MockIntersectionObserver, MockResizeObserver } from '@/test/helpers/observers';
import { installMatchMedia } from '@/test/helpers/matchMedia';
import { resetNavigationState } from '@/test/helpers/nextNavigation';

// Partial mock: notFound / redirect / permanentRedirect / RedirectType stay REAL.
vi.mock('next/navigation', async (importOriginal) => {
  const actual = await importOriginal<typeof import('next/navigation')>();
  const { navigationState } = await import('@/test/helpers/nextNavigation');
  return {
    ...actual,
    useRouter: () => navigationState.router,
    usePathname: () => navigationState.pathname,
    useParams: () => navigationState.params,
    useSearchParams: () => navigationState.searchParams,
  };
});

// Prototype/window APIs jsdom lacks. vi.fn() with no impl: reset between tests by mockReset.
Object.defineProperty(Element.prototype, 'scrollIntoView', { configurable: true, writable: true, value: vi.fn() });
Object.defineProperty(Element.prototype, 'setPointerCapture', { configurable: true, writable: true, value: vi.fn() });
Object.defineProperty(Element.prototype, 'releasePointerCapture', { configurable: true, writable: true, value: vi.fn() });
Object.defineProperty(Element.prototype, 'hasPointerCapture', { configurable: true, writable: true, value: vi.fn(() => false) });
Object.defineProperty(window, 'scrollTo', { configurable: true, writable: true, value: vi.fn() });

beforeEach(() => {
  resetNavigationState();
  MockIntersectionObserver.reset();
  MockResizeObserver.reset();
  vi.stubGlobal('IntersectionObserver', MockIntersectionObserver);
  vi.stubGlobal('ResizeObserver', MockResizeObserver);
  installMatchMedia(); // default: every query matches false
});

afterEach(() => {
  cleanup();
});
