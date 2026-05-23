"use client";

import { useMemo, useState, useTransition } from "react";

import {
  DAY_LABELS,
  FALLBACK_TIMEZONES,
  MAX_INTERVAL_HOURS,
  MAX_TIMES_OF_DAY,
  MIN_INTERVAL_HOURS,
  isValidHHMM,
  type PostingSchedule,
  type PostingScheduleMode,
} from "@/lib/scheduling-shared";

import { updatePostingScheduleAction } from "../actions";

type Props = {
  initial: PostingSchedule;
};

function getTimezoneOptions(): string[] {
  const fallback = FALLBACK_TIMEZONES as readonly string[];
  try {
    const intl = Intl as unknown as {
      supportedValuesOf?: (key: "timeZone") => string[];
    };
    if (typeof intl.supportedValuesOf === "function") {
      const list = intl.supportedValuesOf("timeZone");
      if (Array.isArray(list) && list.length > 0) return list;
    }
  } catch {
    // fall through
  }
  return [...fallback];
}

export default function ScheduleConfigForm({ initial }: Props) {
  // If the user hasn't picked a timezone yet (still on the "UTC" default),
  // seed the input with the browser's detected zone. The initializer runs
  // only on the first render so it works on both the SSR pass (returns
  // server tz, which is fine) and the client pass (returns browser tz).
  const [timezone, setTimezone] = useState(() => {
    if (initial.timezone && initial.timezone !== "UTC") return initial.timezone;
    if (typeof Intl === "undefined") return initial.timezone || "UTC";
    try {
      const local = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (local && local !== "UTC") return local;
    } catch {
      /* ignore */
    }
    return initial.timezone || "UTC";
  });
  const [days, setDays] = useState<number[]>(initial.days_of_week);
  const [mode, setMode] = useState<PostingScheduleMode>(initial.mode);
  const [times, setTimes] = useState<string[]>(
    initial.times_of_day.length > 0 ? initial.times_of_day : ["09:00"]
  );
  const [intervalHours, setIntervalHours] = useState(initial.interval_hours);
  const [intervalStart, setIntervalStart] = useState(initial.interval_start_time);
  const [isActive, setIsActive] = useState(initial.is_active);
  const [newTime, setNewTime] = useState("09:00");

  const [feedback, setFeedback] = useState<{
    kind: "idle" | "saved" | "error";
    message?: string;
  }>({ kind: "idle" });
  const [pending, startTransition] = useTransition();

  const timezoneOptions = useMemo(() => getTimezoneOptions(), []);

  function toggleDay(value: number) {
    setDays((prev) =>
      prev.includes(value)
        ? prev.filter((d) => d !== value)
        : [...prev, value].sort((a, b) => a - b)
    );
    setFeedback({ kind: "idle" });
  }

  function addTime() {
    const v = newTime.trim();
    if (!isValidHHMM(v)) return;
    if (times.includes(v)) return;
    if (times.length >= MAX_TIMES_OF_DAY) return;
    setTimes((prev) => [...prev, v].sort((a, b) => a.localeCompare(b)));
    setFeedback({ kind: "idle" });
  }

  function removeTime(t: string) {
    setTimes((prev) => prev.filter((x) => x !== t));
    setFeedback({ kind: "idle" });
  }

  function handleSave() {
    setFeedback({ kind: "idle" });
    startTransition(async () => {
      const result = await updatePostingScheduleAction({
        timezone,
        days_of_week: days,
        mode,
        times_of_day: times,
        interval_hours: intervalHours,
        interval_start_time: intervalStart,
        is_active: isActive,
      });
      if (!result.ok) {
        setFeedback({ kind: "error", message: result.error });
        return;
      }
      setFeedback({ kind: "saved", message: "Schedule saved." });
    });
  }

  return (
    <section className="rounded-2xl border border-white/[0.06] bg-zinc-900/40 p-6 backdrop-blur-xl">
      <header className="flex items-baseline justify-between gap-2">
        <div>
          <div className="text-[11px] font-mono font-medium uppercase tracking-[0.2em] text-violet-300/80">
            Posting schedule
          </div>
          <h2 className="mt-1 text-lg font-semibold text-white">When to post</h2>
        </div>
        <label className="inline-flex cursor-pointer items-center gap-2 text-xs font-medium text-zinc-300">
          <span className={isActive ? "text-emerald-300" : "text-zinc-400"}>
            {isActive ? "Active" : "Paused"}
          </span>
          <span
            role="switch"
            aria-checked={isActive}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === " " || e.key === "Enter") {
                e.preventDefault();
                setIsActive((v) => !v);
                setFeedback({ kind: "idle" });
              }
            }}
            onClick={() => {
              setIsActive((v) => !v);
              setFeedback({ kind: "idle" });
            }}
            className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
              isActive ? "bg-emerald-500/70" : "bg-zinc-700"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                isActive ? "translate-x-4" : "translate-x-0.5"
              }`}
            />
          </span>
        </label>
      </header>

      <div className="mt-5 space-y-5">
        <div>
          <label htmlFor="timezone" className="block font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500">
            Timezone
          </label>
          <select
            id="timezone"
            value={timezone}
            onChange={(e) => {
              setTimezone(e.target.value);
              setFeedback({ kind: "idle" });
            }}
            className="mt-1.5 w-full rounded-xl border border-white/[0.08] bg-zinc-950/60 px-3 py-2 text-sm text-zinc-100 outline-none transition-colors focus:border-violet-400/40"
          >
            {timezoneOptions.map((tz) => (
              <option key={tz} value={tz} className="bg-zinc-950 text-zinc-100">
                {tz}
              </option>
            ))}
          </select>
        </div>

        <div>
          <span className="block font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500">
            Days
          </span>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {DAY_LABELS.map((d) => {
              const on = days.includes(d.value);
              return (
                <button
                  key={d.value}
                  type="button"
                  onClick={() => toggleDay(d.value)}
                  className={`rounded-lg border px-2.5 py-1 text-xs font-medium transition-colors ${
                    on
                      ? "border-violet-400/40 bg-violet-500/15 text-violet-100"
                      : "border-white/[0.08] bg-white/[0.04] text-zinc-300 hover:bg-white/[0.08]"
                  }`}
                >
                  {d.short}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <span className="block font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500">
            Cadence
          </span>
          <div className="mt-1.5 inline-flex rounded-xl border border-white/[0.08] bg-zinc-950/60 p-1">
            <button
              type="button"
              onClick={() => {
                setMode("times");
                setFeedback({ kind: "idle" });
              }}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                mode === "times"
                  ? "bg-white/[0.08] text-white"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              Times of day
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("interval");
                setFeedback({ kind: "idle" });
              }}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                mode === "interval"
                  ? "bg-white/[0.08] text-white"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              Every N hours
            </button>
          </div>
        </div>

        {mode === "times" ? (
          <div>
            <span className="block font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500">
              Times
            </span>
            {times.length === 0 ? (
              <p className="mt-1.5 text-xs text-amber-200/80">
                Add at least one time below.
              </p>
            ) : (
              <ul className="mt-1.5 flex flex-wrap gap-1.5">
                {times.map((t) => (
                  <li key={t}>
                    <span className="inline-flex items-center gap-1 rounded-full border border-violet-400/30 bg-violet-500/10 px-2.5 py-1 text-xs text-violet-100">
                      {t}
                      <button
                        type="button"
                        onClick={() => removeTime(t)}
                        className="-mr-1 rounded-full p-0.5 text-violet-200/70 transition-colors hover:bg-white/10 hover:text-violet-50"
                        aria-label={`Remove ${t}`}
                      >
                        <CloseIcon />
                      </button>
                    </span>
                  </li>
                ))}
              </ul>
            )}
            {times.length < MAX_TIMES_OF_DAY && (
              <div className="mt-2 flex items-center gap-2">
                <input
                  type="time"
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  className="rounded-lg border border-white/[0.08] bg-zinc-950/60 px-2.5 py-1.5 text-xs text-zinc-100 outline-none focus:border-violet-400/40"
                />
                <button
                  type="button"
                  onClick={addTime}
                  className="rounded-lg border border-white/[0.08] bg-white/[0.04] px-2.5 py-1.5 text-xs font-medium text-zinc-200 transition-colors hover:bg-white/[0.08]"
                >
                  Add
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label
                htmlFor="interval-hours"
                className="block font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500"
              >
                Every (hours)
              </label>
              <input
                id="interval-hours"
                type="number"
                min={MIN_INTERVAL_HOURS}
                max={MAX_INTERVAL_HOURS}
                value={intervalHours}
                onChange={(e) => {
                  setIntervalHours(Number(e.target.value) || 0);
                  setFeedback({ kind: "idle" });
                }}
                className="mt-1.5 w-full rounded-xl border border-white/[0.08] bg-zinc-950/60 px-3 py-2 text-sm text-zinc-100 outline-none transition-colors focus:border-violet-400/40"
              />
            </div>
            <div>
              <label
                htmlFor="interval-start"
                className="block font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500"
              >
                Starting at
              </label>
              <input
                id="interval-start"
                type="time"
                value={intervalStart}
                onChange={(e) => {
                  setIntervalStart(e.target.value);
                  setFeedback({ kind: "idle" });
                }}
                className="mt-1.5 w-full rounded-xl border border-white/[0.08] bg-zinc-950/60 px-3 py-2 text-sm text-zinc-100 outline-none transition-colors focus:border-violet-400/40"
              />
            </div>
          </div>
        )}

        {feedback.kind === "saved" && (
          <p className="rounded-lg border border-emerald-400/30 bg-emerald-500/10 px-3 py-1.5 text-xs text-emerald-100">
            {feedback.message}
          </p>
        )}
        {feedback.kind === "error" && (
          <p className="rounded-lg border border-rose-400/30 bg-rose-500/10 px-3 py-1.5 text-xs text-rose-100">
            {feedback.message}
          </p>
        )}

        <div className="flex justify-end pt-1">
          <button
            type="button"
            onClick={handleSave}
            disabled={pending}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-500 via-fuchsia-500 to-cyan-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-violet-500/30 transition-all hover:shadow-fuchsia-500/40 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {pending && <Spinner />}
            <span>{pending ? "Saving…" : "Save schedule"}</span>
          </button>
        </div>
      </div>
    </section>
  );
}

function CloseIcon() {
  return (
    <svg className="h-2.5 w-2.5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M6 6l12 12M6 18L18 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function Spinner() {
  return (
    <svg className="h-3.5 w-3.5 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity="0.25" strokeWidth="4" />
      <path d="M22 12a10 10 0 0 1-10 10" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}
