type EntryInput = { target: Element; isIntersecting: boolean; top?: number };

function makeRect(top: number): DOMRectReadOnly {
  return {
    x: 0,
    y: top,
    top,
    left: 0,
    right: 0,
    bottom: top,
    width: 0,
    height: 0,
    toJSON: () => ({}),
  } as DOMRectReadOnly;
}

function makeEntry({ target, isIntersecting, top = 0 }: EntryInput): IntersectionObserverEntry {
  return {
    target,
    isIntersecting,
    intersectionRatio: isIntersecting ? 1 : 0,
    boundingClientRect: makeRect(top),
    intersectionRect: makeRect(top),
    rootBounds: null,
    time: 0,
  } as IntersectionObserverEntry;
}

export class MockIntersectionObserver {
  static instances: MockIntersectionObserver[] = [];

  static reset(): void {
    MockIntersectionObserver.instances = [];
  }

  readonly root = null;
  readonly rootMargin: string;
  readonly thresholds: readonly number[];
  readonly observed = new Set<Element>();

  constructor(
    private readonly callback: IntersectionObserverCallback,
    readonly options: IntersectionObserverInit = {},
  ) {
    this.rootMargin = options.rootMargin ?? '0px';
    this.thresholds = Array.isArray(options.threshold) ? options.threshold : [options.threshold ?? 0];
    MockIntersectionObserver.instances.push(this);
  }

  observe(element: Element): void {
    this.observed.add(element);
  }

  unobserve(element: Element): void {
    this.observed.delete(element);
  }

  disconnect(): void {
    this.observed.clear();
  }

  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }

  /** Fires the callback with one entry. Wrap in act(): act(() => io.trigger(true)). */
  trigger(isIntersecting: boolean, target?: Element): void {
    const element = target ?? [...this.observed][0] ?? document.body;
    this.callback([makeEntry({ target: element, isIntersecting })], this as unknown as IntersectionObserver);
  }

  /** Fires the callback with several entries at once (`top` becomes `boundingClientRect.top`). */
  triggerMany(entries: EntryInput[]): void {
    this.callback(entries.map(makeEntry), this as unknown as IntersectionObserver);
  }
}

export class MockResizeObserver {
  static instances: MockResizeObserver[] = [];

  static reset(): void {
    MockResizeObserver.instances = [];
  }

  readonly observed = new Set<Element>();

  constructor(private readonly callback: ResizeObserverCallback) {
    MockResizeObserver.instances.push(this);
  }

  observe(element: Element): void {
    this.observed.add(element);
  }

  unobserve(element: Element): void {
    this.observed.delete(element);
  }

  disconnect(): void {
    this.observed.clear();
  }

  /** Fires the callback with a `width` x `height` box for `target` (default: the first observed element). */
  trigger(width: number, height = 0, target?: Element): void {
    const element = target ?? [...this.observed][0] ?? document.body;
    const size = { inlineSize: width, blockSize: height };
    const entry = {
      target: element,
      contentRect: {
        x: 0,
        y: 0,
        top: 0,
        left: 0,
        width,
        height,
        right: width,
        bottom: height,
        toJSON: () => ({}),
      },
      contentBoxSize: [size],
      borderBoxSize: [size],
      devicePixelContentBoxSize: [size],
    } as unknown as ResizeObserverEntry;
    this.callback([entry], this as unknown as ResizeObserver);
  }
}
