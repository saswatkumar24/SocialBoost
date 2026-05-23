// Pure (no `server-only`) helpers for computing the next available slot in a
// user's posting schedule. Both server actions and the client-side preview can
// call these to keep the UX consistent.
//
// All date math is done by deriving the wall-clock components of a UTC instant
// in the schedule's IANA timezone via `Intl.DateTimeFormat`. We round-trip
// wall-clock <-> UTC by computing the timezone's offset at an approximate
// instant and adjusting. This handles DST correctly except for the ~1hr
// ambiguity around spring-forward/fall-back, which we ignore for v1.

import {
  type PostingSchedule,
  isValidHHMM,
} from "./scheduling-shared";

// --- timezone primitives ------------------------------------------------

type WallParts = {
  year: number;
  month: number; // 1..12
  day: number; // 1..31
  hour: number; // 0..23
  minute: number; // 0..59
  second: number; // 0..59
};

const WALL_FMT_CACHE = new Map<string, Intl.DateTimeFormat>();

function getWallFmt(tz: string): Intl.DateTimeFormat {
  let dtf = WALL_FMT_CACHE.get(tz);
  if (!dtf) {
    dtf = new Intl.DateTimeFormat("en-US", {
      timeZone: tz,
      hourCycle: "h23",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    WALL_FMT_CACHE.set(tz, dtf);
  }
  return dtf;
}

export function wallPartsInTz(date: Date, tz: string): WallParts {
  const parts = getWallFmt(tz).formatToParts(date);
  const map: Record<string, string> = {};
  for (const p of parts) {
    if (p.type !== "literal") map[p.type] = p.value;
  }
  const hour = Number(map.hour);
  return {
    year: Number(map.year),
    month: Number(map.month),
    day: Number(map.day),
    // Some ICU builds return "24" for midnight; normalize back to 0.
    hour: hour === 24 ? 0 : hour,
    minute: Number(map.minute),
    second: Number(map.second),
  };
}

// Convert a wall-clock { Y, M, D, h, m } in `tz` into a UTC `Date`.
// Uses two passes so that daylight-saving offset transitions converge.
export function wallTimeToUtc(
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number,
  tz: string
): Date {
  const targetWallMs = Date.UTC(year, month - 1, day, hour, minute, 0);

  function offsetAt(utcMs: number): number {
    const w = wallPartsInTz(new Date(utcMs), tz);
    const wallAsUtc = Date.UTC(w.year, w.month - 1, w.day, w.hour, w.minute, w.second);
    return wallAsUtc - utcMs;
  }

  let utcMs = targetWallMs - offsetAt(targetWallMs);
  // Second pass to settle on DST boundaries.
  utcMs = targetWallMs - offsetAt(utcMs);
  return new Date(utcMs);
}

// 0=Sun..6=Sat for the given UTC instant in `tz`. Computed via UTC re-encode
// of the wall-clock parts so JS's getUTCDay returns the in-tz weekday.
export function dayOfWeekInTz(date: Date, tz: string): number {
  const w = wallPartsInTz(date, tz);
  return new Date(Date.UTC(w.year, w.month - 1, w.day)).getUTCDay();
}

// --- slot expansion -----------------------------------------------------

function parseHHMM(value: string): { hour: number; minute: number } | null {
  if (!isValidHHMM(value)) return null;
  const [hStr, mStr] = value.split(":");
  return { hour: Number(hStr), minute: Number(mStr) };
}

// Returns "HH:MM" wall-clock slots within a single day, starting at `start`
// and stepping by `intervalHours`. Ends when the next slot would cross
// midnight.
export function expandIntervalSlots(
  start: string,
  intervalHours: number
): string[] {
  const parsed = parseHHMM(start);
  if (!parsed) return [];
  const stepMin = Math.max(1, Math.floor(intervalHours * 60));
  const slots: string[] = [];
  let mins = parsed.hour * 60 + parsed.minute;
  while (mins < 24 * 60) {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    slots.push(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`);
    mins += stepMin;
  }
  return slots;
}

function dailySlotsFor(schedule: PostingSchedule): string[] {
  if (schedule.mode === "interval") {
    return expandIntervalSlots(schedule.interval_start_time, schedule.interval_hours);
  }
  // mode === "times"
  return [...schedule.times_of_day]
    .filter(isValidHHMM)
    .sort((a, b) => a.localeCompare(b));
}

// --- next slot ----------------------------------------------------------

const TAKEN_TOLERANCE_MS = 60_000; // ±1 minute counts as the same slot
const MAX_LOOKAHEAD_DAYS = 60;

export type ComputeNextSlotOptions = {
  /** Look-ahead horizon in days. Defaults to 60. */
  maxDays?: number;
};

export function computeNextSlot(
  schedule: PostingSchedule,
  takenAt: Date[],
  now: Date,
  options: ComputeNextSlotOptions = {}
): Date | null {
  if (!schedule.is_active) return null;

  const tz = schedule.timezone || "UTC";
  const days = new Set(schedule.days_of_week ?? []);
  if (days.size === 0) return null;

  const slots = dailySlotsFor(schedule);
  if (slots.length === 0) return null;

  const takenMs = takenAt.map((d) => d.getTime()).sort((a, b) => a - b);

  function isTaken(candidateMs: number): boolean {
    for (const t of takenMs) {
      if (Math.abs(t - candidateMs) <= TAKEN_TOLERANCE_MS) return true;
      if (t > candidateMs + TAKEN_TOLERANCE_MS) break;
    }
    return false;
  }

  const { year, month, day } = wallPartsInTz(now, tz);
  const maxDays = options.maxDays ?? MAX_LOOKAHEAD_DAYS;

  for (let offset = 0; offset < maxDays; offset++) {
    // Anchor of the day under consideration (00:00 wall-clock in tz).
    const dayUtc = wallTimeToUtc(year, month, day + offset, 0, 0, tz);
    const dow = dayOfWeekInTz(dayUtc, tz);
    if (!days.has(dow)) continue;

    const w = wallPartsInTz(dayUtc, tz);

    for (const hhmm of slots) {
      const parsed = parseHHMM(hhmm);
      if (!parsed) continue;
      const slotUtc = wallTimeToUtc(
        w.year,
        w.month,
        w.day,
        parsed.hour,
        parsed.minute,
        tz
      );
      const slotMs = slotUtc.getTime();
      if (slotMs <= now.getTime()) continue;
      if (isTaken(slotMs)) continue;
      return slotUtc;
    }
  }

  return null;
}

// Convenience: a stable string formatter for a "next slot" preview line in
// the user's tz. Works on both server and client.
export function formatSlotInTz(date: Date, tz: string): string {
  const dtf = new Intl.DateTimeFormat(undefined, {
    timeZone: tz,
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  });
  return dtf.format(date);
}
