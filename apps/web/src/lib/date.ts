/**
 * Date helpers for habit tracking. All dates are normalized to UTC midnight to
 * match Prisma's `@db.Date` columns. v1 uses a single server timezone; per-user
 * timezones are out of scope.
 */

const MS_PER_DAY = 24 * 60 * 60 * 1000;

/** UTC midnight for "today". */
export function getToday(): Date {
  const now = new Date();
  return new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
  );
}

/** UTC midnight for the given date. */
export function toDateOnly(date: Date): Date {
  return new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())
  );
}

/** `YYYY-MM-DD` key (UTC) for comparing/grouping by day. */
export function toDateKey(date: Date): string {
  return toDateOnly(date).toISOString().slice(0, 10);
}

/** Add (or subtract) whole days, preserving UTC midnight. */
export function addDays(date: Date, days: number): Date {
  return new Date(toDateOnly(date).getTime() + days * MS_PER_DAY);
}

/** Monday-based start of the week (UTC midnight) for the given date. */
export function startOfWeek(date: Date = getToday()): Date {
  const day = toDateOnly(date);
  const weekday = day.getUTCDay(); // 0 = Sunday
  const diff = (weekday + 6) % 7; // days since Monday
  return addDays(day, -diff);
}

/** Parse a `YYYY-MM-DD` string into a UTC-midnight Date, or null if invalid. */
export function parseDateKey(value: string): Date | null {
  const match = /^\d{4}-\d{2}-\d{2}$/.exec(value);
  if (!match) {
    return null;
  }

  const parsed = new Date(`${value}T00:00:00.000Z`);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}
