import { vi } from 'vitest';

export interface MatchMediaController {
  /** Sets one query and dispatches 'change' to its listeners (addEventListener and legacy addListener). Wrap in act(). */
  setMatches(query: string, matches: boolean): void;
  listenerCount(query: string): number;
}

type Listener = (event: MediaQueryListEvent) => void;

/** Installs window.matchMedia via vi.stubGlobal. Unlisted queries match false. Safe to call again inside a test to override. */
export function installMatchMedia(initial: Record<string, boolean> = {}): MatchMediaController {
  const state = new Map<string, boolean>(Object.entries(initial));
  const listeners = new Map<string, Set<Listener>>();

  const listenersFor = (query: string): Set<Listener> => {
    let set = listeners.get(query);
    if (!set) {
      set = new Set();
      listeners.set(query, set);
    }
    return set;
  };

  const matchMedia = (query: string): MediaQueryList =>
    ({
      media: query,
      get matches() {
        return state.get(query) ?? false;
      },
      onchange: null,
      addEventListener: (type: string, listener: Listener) => {
        if (type === 'change') listenersFor(query).add(listener);
      },
      removeEventListener: (type: string, listener: Listener) => {
        if (type === 'change') listenersFor(query).delete(listener);
      },
      addListener: (listener: Listener) => {
        listenersFor(query).add(listener);
      },
      removeListener: (listener: Listener) => {
        listenersFor(query).delete(listener);
      },
      dispatchEvent: () => true,
    }) as unknown as MediaQueryList;

  vi.stubGlobal('matchMedia', matchMedia);

  return {
    setMatches(query, matches) {
      state.set(query, matches);
      for (const listener of [...listenersFor(query)]) {
        listener({ matches, media: query } as MediaQueryListEvent);
      }
    },
    listenerCount: (query) => listenersFor(query).size,
  };
}
