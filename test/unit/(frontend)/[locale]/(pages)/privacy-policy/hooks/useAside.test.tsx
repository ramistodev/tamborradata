import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useAside } from '@/app/(frontend)/[locale]/(pages)/privacy-policy/hooks/useAside';
import { installDialogStubs } from '@/test/helpers/dialog';
import { MockIntersectionObserver } from '@/test/helpers/observers';

describe('useAside', () => {
  beforeEach(() => {
    installDialogStubs();
    for (const id of ['a', 'b', 'c']) {
      const section = document.createElement('section');
      section.id = id;
      document.body.append(section);
    }
  });
  afterEach(() => document.querySelectorAll('section').forEach((section) => section.remove()));

  it('observes existing sections with the configured root margin', () => {
    const { result } = renderHook(() => useAside(['a', 'b', 'c']));
    const io = MockIntersectionObserver.instances[0];
    expect(result.current.activeId).toBe('a');
    expect(MockIntersectionObserver.instances).toHaveLength(1);
    expect(io.options.rootMargin).toBe('-20% 0px -70% 0px');
    expect([...io.observed].map((element) => element.id)).toEqual(['a', 'b', 'c']);
  });

  it('skips missing ids and uses the first intersecting entry', () => {
    const { result } = renderHook(() => useAside(['a', 'zzz']));
    const io = MockIntersectionObserver.instances[0];
    const a = document.getElementById('a') as HTMLElement;
    const b = document.getElementById('b') as HTMLElement;
    expect([...io.observed]).toEqual([a]);
    act(() => io.triggerMany([{ target: b, isIntersecting: false }]));
    expect(result.current.activeId).toBe('a');
    act(() => io.triggerMany([{ target: b, isIntersecting: true }]));
    expect(result.current.activeId).toBe('b');
    act(() => io.triggerMany([{ target: a, isIntersecting: true }, { target: b, isIntersecting: true }]));
    expect(result.current.activeId).toBe('a');
  });

  it('rebuilds the observer when ids change and disconnects on unmount', () => {
    const { rerender, unmount } = renderHook(({ ids }) => useAside(ids), {
      initialProps: { ids: ['a', 'b'] },
    });
    const first = MockIntersectionObserver.instances[0];
    const disconnect = vi.spyOn(first, 'disconnect');
    rerender({ ids: ['b', 'c'] });
    expect(disconnect).toHaveBeenCalledOnce();
    expect(MockIntersectionObserver.instances).toHaveLength(2);
    const second = MockIntersectionObserver.instances[1];
    unmount();
    expect(second.observed.size).toBe(0);
  });

  it('opens and handles dialog close state while restoring overflow', () => {
    const { result } = renderHook(() => useAside(['a']));
    const dialog = document.createElement('dialog');
    document.body.append(dialog);
    result.current.dialogRef.current = dialog;
    act(() => result.current.openDialog());
    expect(dialog.showModal).toHaveBeenCalledOnce();
    expect(result.current.open).toBe(true);
    expect(document.body.style.overflow).toBe('hidden');
    act(() => result.current.handleClose());
    expect(result.current.open).toBe(false);
    expect(document.body.style.overflow).toBe('');
  });

  it('closes through closeDialog and only treats the backdrop as a close click', () => {
    const { result } = renderHook(() => useAside(['a']));
    const dialog = document.createElement('dialog');
    document.body.append(dialog);
    result.current.dialogRef.current = dialog;
    act(() => result.current.openDialog());
    act(() => result.current.closeDialog());
    expect(dialog.close).toHaveBeenCalledOnce();
    act(() => result.current.openDialog());
    result.current.handleDialogClick({ target: document.body, currentTarget: dialog } as never);
    expect(dialog.close).toHaveBeenCalledOnce();
    result.current.handleDialogClick({ target: dialog, currentTarget: dialog } as never);
    expect(dialog.close).toHaveBeenCalledTimes(2);
  });
});
