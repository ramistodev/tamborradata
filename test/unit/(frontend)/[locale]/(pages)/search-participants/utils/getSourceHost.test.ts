import { describe, expect, it } from 'vitest';

import { getSourceHost } from '@/app/(frontend)/[locale]/(pages)/search-participants/utils/getSourceHost';

describe('getSourceHost', () => {
  it.each([
    ['https://www.donostia.eus/path?q=1', 'donostia.eus'],
    ['https://example.org', 'example.org'],
    ['http://sub.www.example.org/x', 'sub.www.example.org'],
    ['https://WWW.Example.org', 'example.org'],
    ['not a url', 'not a url'],
    ['', ''],
  ])('turns %j into %j', (url, host) => {
    expect(getSourceHost(url)).toBe(host);
  });
});
