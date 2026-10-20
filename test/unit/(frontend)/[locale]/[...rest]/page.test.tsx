import { describe, expect, it } from 'vitest';
import CatchAllPage from '@/app/(frontend)/[locale]/[...rest]/page';

function catchValue(fn: () => unknown): unknown {
  try {
    fn();
  } catch (error) {
    return error;
  }
  throw new Error('expected the call to throw');
}

describe('[...rest] page', () => {
  it('responds with a 404 for any unknown path', () => {
    expect(catchValue(() => CatchAllPage())).toMatchObject({ digest: 'NEXT_HTTP_ERROR_FALLBACK;404' });
  });
});
