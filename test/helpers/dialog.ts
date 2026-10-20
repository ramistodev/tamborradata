import { vi } from 'vitest';

/** jsdom does not implement HTMLDialogElement.showModal/show/close. Call it in `beforeEach` of tests that render a <dialog>. */
export function installDialogStubs(): void {
  const open = vi.fn(function (this: HTMLDialogElement) {
    this.setAttribute('open', '');
  });
  const close = vi.fn(function (this: HTMLDialogElement) {
    if (!this.hasAttribute('open')) return;
    this.removeAttribute('open');
    this.dispatchEvent(new Event('close'));
  });
  const define = (name: string, value: unknown) =>
    Object.defineProperty(HTMLDialogElement.prototype, name, { configurable: true, writable: true, value });

  define('showModal', open);
  define('show', open);
  define('close', close);
}
