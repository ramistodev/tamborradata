/** Whole minutes to wait, rounded up and never below one, so the message never says "0 minutes". */
export function getRetryMinutes(retryAfterSeconds: number): number {
  return Number.isFinite(retryAfterSeconds) && retryAfterSeconds > 0
    ? Math.ceil(retryAfterSeconds / 60)
    : 1;
}
