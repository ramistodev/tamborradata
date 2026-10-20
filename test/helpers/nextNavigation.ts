import { vi } from 'vitest';
import { singleton } from './singleton';

export type NavigationParams = Record<string, string | string[]>;

export function makeRouter() {
  return {
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
    prefetch: vi.fn(),
  };
}

export const navigationState = singleton('navigationState', () => ({
  pathname: '/',
  params: {} as NavigationParams,
  searchParams: new URLSearchParams(),
  router: makeRouter(),
}));

export function resetNavigationState(): void {
  navigationState.pathname = '/';
  navigationState.params = {};
  navigationState.searchParams = new URLSearchParams();
  navigationState.router = makeRouter();
}
