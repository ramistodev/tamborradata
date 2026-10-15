export class RateLimitedError extends Error {
  constructor(public readonly retryAfterSeconds: number) {
    super('Rate limited');
  }
}
