// updated_at is touched by the publish itself, so ignore differences under a minute
const MODIFIED_TOLERANCE_MS = 60_000;

/** True when the period was changed noticeably after it was published. Takes ISO date strings. */
export function wasModified(publishedAt: string, updatedAt: string) {
  return new Date(updatedAt).getTime() - new Date(publishedAt).getTime() > MODIFIED_TOLERANCE_MS;
}
