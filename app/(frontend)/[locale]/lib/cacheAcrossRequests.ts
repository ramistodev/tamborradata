import 'server-only';
import { unstable_cache } from 'next/cache';
import { isDev } from '../../../(backend)/core/config/env';

/**
 * `unstable_cache` that is skipped in development, so a stale entry on disk (for example after a
 * response shape change) can never hide what the backend currently returns.
 */
export const cacheAcrossRequests: typeof unstable_cache = (callback, keyParts, options) =>
  isDev ? callback : unstable_cache(callback, keyParts, options);
