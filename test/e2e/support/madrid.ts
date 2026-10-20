/** True from 17 to 24 January (both included) in the Europe/Madrid calendar: the seasonal rate-limit window. */
export function isSeasonalRateLimitWindow(now: Date = new Date()): boolean {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Madrid',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(now);
  const month = parts.find((part) => part.type === 'month')?.value ?? '';
  const day = parts.find((part) => part.type === 'day')?.value ?? '';
  const monthDay = `${month}-${day}`;
  return monthDay >= '01-17' && monthDay <= '01-24';
}
