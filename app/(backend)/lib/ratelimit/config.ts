import 'server-only';

export interface RateLimitRule {
  /** Requests allowed per client within one window. */
  max: number;
  windowSeconds: number;
}

/** A rule that applies between two days of the year, both included. Dates are `MM-DD`. */
interface SeasonalRule extends RateLimitRule {
  from: string;
  to: string;
}

const TIME_ZONE = 'Europe/Madrid';

const DEFAULT_RULE: RateLimitRule = { max: 30, windowSeconds: 40 * 60 };

/**
 * Looser limits around the Tamborrada (20 January), when many people search from the same
 * network. The first rule that matches wins. Dates have no year, so they repeat every year.
 */
const SEASONAL_RULES: SeasonalRule[] = [{ from: '01-17', to: '01-24', max: 30, windowSeconds: 60 }];

// Day of the year in Spain, not in UTC (the server's time zone), so a rule starts at midnight there
function getMonthDay(now: Date): string {
  return now.toLocaleDateString('en-CA', { timeZone: TIME_ZONE }).slice(5);
}

// A range such as 12-28 to 01-03 crosses the end of the year
function isWithin(monthDay: string, { from, to }: SeasonalRule): boolean {
  return from <= to ? monthDay >= from && monthDay <= to : monthDay >= from || monthDay <= to;
}

/** The rate limit that applies on the given moment. */
export function getRateLimitRule(now: Date = new Date()): RateLimitRule {
  const monthDay = getMonthDay(now);
  const seasonalRule = SEASONAL_RULES.find((rule) => isWithin(monthDay, rule));

  return seasonalRule
    ? { max: seasonalRule.max, windowSeconds: seasonalRule.windowSeconds }
    : DEFAULT_RULE;
}
