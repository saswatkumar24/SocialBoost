// Shared types and constants for the LinkedIn post scheduler. Safe to import
// from both server and client components — no `server-only`, no Node APIs.

export type PostingScheduleMode = "times" | "interval";

export type PostingSchedule = {
  user_id: string;
  timezone: string;
  days_of_week: number[]; // 0=Sun..6=Sat
  mode: PostingScheduleMode;
  times_of_day: string[]; // "HH:MM" 24h
  interval_hours: number;
  interval_start_time: string; // "HH:MM" 24h
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type ScheduledPostStatus =
  | "queued"
  | "publishing"
  | "published"
  | "failed"
  | "cancelled";

export type ScheduledPost = {
  id: string;
  user_id: string;
  body: string;
  status: ScheduledPostStatus;
  scheduled_at: string;
  published_at: string | null;
  post_urn: string | null;
  error_message: string | null;
  attempts: number;
  topic_title: string | null;
  topic_format: string | null;
  created_at: string;
  updated_at: string;
  is_recurring?: boolean;
  recurrence_interval_days?: number | null;
};

export const DEFAULT_POSTING_SCHEDULE: Omit<
  PostingSchedule,
  "user_id" | "created_at" | "updated_at"
> = {
  timezone: "UTC",
  days_of_week: [1, 2, 3, 4, 5],
  mode: "times",
  times_of_day: ["09:00", "13:00", "17:00"],
  interval_hours: 4,
  interval_start_time: "09:00",
  is_active: true,
};

export const DAY_LABELS = [
  { value: 0, short: "Sun", long: "Sunday" },
  { value: 1, short: "Mon", long: "Monday" },
  { value: 2, short: "Tue", long: "Tuesday" },
  { value: 3, short: "Wed", long: "Wednesday" },
  { value: 4, short: "Thu", long: "Thursday" },
  { value: 5, short: "Fri", long: "Friday" },
  { value: 6, short: "Sat", long: "Saturday" },
] as const;

export const MAX_TIMES_OF_DAY = 8;
export const MAX_QUEUE_BODY = 3000;
export const MIN_INTERVAL_HOURS = 1;
export const MAX_INTERVAL_HOURS = 168;

// Common timezone shortlist used when `Intl.supportedValuesOf` isn't available
// (older runtimes). Kept short and ordered roughly by user share.
export const FALLBACK_TIMEZONES = [
  "UTC",
  "America/Los_Angeles",
  "America/Denver",
  "America/Chicago",
  "America/New_York",
  "America/Toronto",
  "America/Mexico_City",
  "America/Sao_Paulo",
  "Europe/London",
  "Europe/Dublin",
  "Europe/Paris",
  "Europe/Berlin",
  "Europe/Madrid",
  "Europe/Amsterdam",
  "Europe/Stockholm",
  "Africa/Johannesburg",
  "Asia/Dubai",
  "Asia/Karachi",
  "Asia/Kolkata",
  "Asia/Bangkok",
  "Asia/Singapore",
  "Asia/Hong_Kong",
  "Asia/Shanghai",
  "Asia/Tokyo",
  "Australia/Sydney",
  "Pacific/Auckland",
] as const;

export function isValidHHMM(value: string): boolean {
  return /^([01]\d|2[0-3]):[0-5]\d$/.test(value);
}

export function compareHHMM(a: string, b: string): number {
  return a.localeCompare(b);
}

export function isValidIanaTimezone(tz: string): boolean {
  if (!tz || typeof tz !== "string") return false;
  try {
    new Intl.DateTimeFormat("en-US", { timeZone: tz });
    return true;
  } catch {
    return false;
  }
}
