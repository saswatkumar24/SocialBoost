"use client";

import { useState, useTransition } from "react";

import type { ScheduledPost } from "@/lib/scheduling-shared";
import { wallPartsInTz, wallTimeToUtc, dayOfWeekInTz } from "@/lib/scheduling-slots";

import { cancelQueuedAction, requeueFailedAction } from "../actions";

type QueueBoardProps = {
  initialQueued: ScheduledPost[];
  initialHistory: ScheduledPost[];
  timezone: string;
  aiTopicSchedules?: any[];
};

const STATUS_LABELS: Record<string, string> = {
  queued: "Queued",
  publishing: "Publishing",
  published: "Published",
  failed: "Failed",
  cancelled: "Cancelled",
};

const STATUS_STYLES: Record<string, string> = {
  queued: "border-violet-400/30 bg-violet-500/10 text-violet-100",
  publishing: "border-cyan-400/30 bg-cyan-500/10 text-cyan-100",
  published: "border-emerald-400/30 bg-emerald-500/10 text-emerald-100",
  failed: "border-rose-400/30 bg-rose-500/10 text-rose-100",
  cancelled: "border-zinc-400/20 bg-zinc-500/10 text-zinc-300",
};

function formatScheduled(iso: string, timezone: string): string {
  try {
    return new Intl.DateTimeFormat(undefined, {
      timeZone: timezone,
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      timeZoneName: "short",
    }).format(new Date(iso));
  } catch {
    return new Date(iso).toLocaleString();
  }
}

export default function QueueBoard({
  initialQueued,
  initialHistory,
  timezone,
  aiTopicSchedules = [],
}: QueueBoardProps) {
  const [queued, setQueued] = useState<ScheduledPost[]>(initialQueued);
  const [history, setHistory] = useState<ScheduledPost[]>(initialHistory);
  const [error, setError] = useState<string | null>(null);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  // Generate virtual placeholders for Autopilot schedules in the next 7 days
  const placeholders: ScheduledPost[] = [];
  if (aiTopicSchedules && aiTopicSchedules.length > 0) {
    const activeSchedules = aiTopicSchedules.filter((s) => s.is_active);
    const now = new Date();
    const { year, month, day } = wallPartsInTz(now, timezone);

    // Look ahead 7 days
    for (let offset = 0; offset <= 7; offset++) {
      const dayUtc = wallTimeToUtc(year, month, day + offset, 0, 0, timezone);
      const w = wallPartsInTz(dayUtc, timezone);
      const dow = dayOfWeekInTz(dayUtc, timezone);

      for (const schedule of activeSchedules) {
        const slots = Array.isArray(schedule.slots) ? schedule.slots : [];
        for (const slot of slots) {
          if (Number(slot.day) === dow) {
            const [hStr, mStr] = slot.time.split(":");
            const hour = Number(hStr);
            const minute = Number(mStr);
            if (!isNaN(hour) && !isNaN(minute)) {
              const slotUtc = wallTimeToUtc(w.year, w.month, w.day, hour, minute, timezone);
              const slotMs = slotUtc.getTime();

              if (slotMs > now.getTime()) {
                // Check if a real post is already scheduled here
                const hasRealPost = queued.some((p) => {
                  const pMs = new Date(p.scheduled_at).getTime();
                  return Math.abs(pMs - slotMs) <= 60000;
                });

                if (!hasRealPost) {
                  placeholders.push({
                    id: `autopilot-${schedule.id}-${slotMs}`,
                    user_id: "",
                    body: `🤖 AI Autopilot will automatically draft and queue a post about "${schedule.topic_name}" 2 hours before this slot.`,
                    status: "queued",
                    scheduled_at: slotUtc.toISOString(),
                    is_recurring: false,
                    topic_title: schedule.topic_name,
                    is_autopilot_placeholder: true,
                  } as any);
                }
              }
            }
          }
        }
      }
    }
  }

  const combinedQueue = [...queued, ...placeholders].sort(
    (a, b) =>
      new Date(a.scheduled_at).getTime() - new Date(b.scheduled_at).getTime()
  );

  function handleCancel(id: string) {
    setError(null);
    setPendingId(id);
    const previous = queued;
    setQueued((prev) => prev.filter((p) => p.id !== id));
    startTransition(async () => {
      const result = await cancelQueuedAction(id);
      setPendingId(null);
      if (!result.ok) {
        setQueued(previous);
        setError(result.error);
      }
    });
  }

  function handleRequeue(id: string) {
    setError(null);
    setPendingId(id);
    const previousHistory = history;
    startTransition(async () => {
      const result = await requeueFailedAction(id);
      setPendingId(null);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      const post = previousHistory.find((p) => p.id === id);
      setHistory((prev) => prev.filter((p) => p.id !== id));
      if (post) {
        const requeued: ScheduledPost = {
          ...post,
          status: "queued",
          scheduled_at: result.scheduledAt,
          error_message: null,
          attempts: 0,
        };
        setQueued((prev) =>
          [...prev, requeued].sort(
            (a, b) =>
              new Date(a.scheduled_at).getTime() -
              new Date(b.scheduled_at).getTime()
          )
        );
      }
    });
  }

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-white/[0.06] bg-zinc-900/40 p-6 backdrop-blur-xl">
        <header className="flex items-baseline justify-between gap-2">
          <div>
            <div className="text-[11px] font-mono font-medium uppercase tracking-[0.2em] text-violet-300/80">
              Queue
            </div>
            <h2 className="mt-1 text-lg font-semibold text-white">
              Upcoming posts
              <span className="ml-2 text-sm font-normal text-zinc-500">
                ({combinedQueue.length})
              </span>
            </h2>
          </div>
        </header>

        {error && (
          <div className="mt-4 rounded-xl border border-rose-400/30 bg-rose-500/10 px-3 py-2 text-xs text-rose-100">
            {error}
          </div>
        )}

        {combinedQueue.length === 0 ? (
          <div className="mt-5 rounded-xl border border-dashed border-white/[0.08] bg-zinc-950/40 p-8 text-center text-sm text-zinc-400">
            No queued posts yet. Compose one above and hit{" "}
            <span className="text-zinc-200">Add to queue</span>.
          </div>
        ) : (
          <ol className="mt-5 space-y-3">
            {combinedQueue.map((post: any) => (
              <li
                key={post.id}
                className={`group relative overflow-hidden rounded-xl border p-4 transition-colors ${
                  post.is_autopilot_placeholder
                    ? "border-violet-500/20 bg-violet-950/15 border-dashed"
                    : "border-white/[0.06] bg-zinc-950/40 hover:border-white/10"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      {post.is_autopilot_placeholder ? (
                        <span className="inline-flex items-center rounded-full border border-fuchsia-500/30 bg-fuchsia-500/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-fuchsia-300">
                          🤖 Autopilot Slot
                        </span>
                      ) : (
                        <StatusPill status={post.status} />
                      )}
                      <span suppressHydrationWarning className="font-mono text-[11px] uppercase tracking-wider text-zinc-400">
                        {formatScheduled(post.scheduled_at, timezone)}
                      </span>
                      {post.is_recurring && (
                        <span className="inline-flex items-center gap-1 rounded bg-cyan-500/10 border border-cyan-400/20 px-2 py-0.5 text-[10px] font-medium text-cyan-300">
                          🔁 Every {post.recurrence_interval_days} days
                        </span>
                      )}
                    </div>
                    {post.topic_title && (
                      <div className="mt-1 truncate text-[11px] text-zinc-500">
                        Topic: {post.topic_title}
                      </div>
                    )}
                    <p className={`mt-2 line-clamp-3 whitespace-pre-line text-sm leading-relaxed ${
                      post.is_autopilot_placeholder ? "text-zinc-400 italic" : "text-zinc-200"
                    }`}>
                      {post.body}
                    </p>
                  </div>
                  {!post.is_autopilot_placeholder && (
                    <button
                      type="button"
                      onClick={() => handleCancel(post.id)}
                      disabled={pendingId === post.id || post.status === "publishing"}
                      className="shrink-0 rounded-lg border border-white/[0.08] bg-white/[0.04] px-2.5 py-1 text-[11px] font-medium text-zinc-300 transition-colors hover:bg-white/[0.08] disabled:cursor-not-allowed disabled:opacity-50"
                      title={
                        post.status === "publishing"
                          ? "Already being published"
                          : "Cancel"
                      }
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ol>
        )}
      </section>

      <section className="rounded-2xl border border-white/[0.06] bg-zinc-900/40 p-6 backdrop-blur-xl">
        <header className="flex items-baseline justify-between gap-2">
          <div>
            <div className="text-[11px] font-mono font-medium uppercase tracking-[0.2em] text-violet-300/80">
              History
            </div>
            <h2 className="mt-1 text-lg font-semibold text-white">Recent activity</h2>
          </div>
        </header>

        {history.length === 0 ? (
          <p className="mt-5 text-sm text-zinc-400">
            Published, failed, and cancelled posts will show up here.
          </p>
        ) : (
          <ol className="mt-5 space-y-3">
            {history.map((post) => (
              <li
                key={post.id}
                className="rounded-xl border border-white/[0.06] bg-zinc-950/40 p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <StatusPill status={post.status} />
                      <span suppressHydrationWarning className="font-mono text-[11px] uppercase tracking-wider text-zinc-400">
                        {post.published_at
                          ? formatScheduled(post.published_at, timezone)
                          : formatScheduled(post.scheduled_at, timezone)}
                      </span>
                      {post.is_recurring && (
                        <span className="inline-flex items-center gap-1 rounded bg-cyan-500/10 border border-cyan-400/20 px-2 py-0.5 text-[10px] font-medium text-cyan-300">
                          🔁 Every {post.recurrence_interval_days} days
                        </span>
                      )}
                    </div>
                    <p className="mt-2 line-clamp-3 whitespace-pre-line text-sm leading-relaxed text-zinc-200">
                      {post.body}
                    </p>
                    {post.error_message && (
                      <p className="mt-2 line-clamp-2 text-xs text-rose-200/90">
                        {post.error_message}
                      </p>
                    )}
                    {post.post_urn && (
                      <p className="mt-1 break-all font-mono text-[10px] text-emerald-200/70">
                        {post.post_urn}
                      </p>
                    )}
                  </div>
                  {post.status === "failed" && (
                    <button
                      type="button"
                      onClick={() => handleRequeue(post.id)}
                      disabled={pendingId === post.id}
                      className="shrink-0 rounded-lg border border-violet-400/30 bg-violet-500/10 px-2.5 py-1 text-[11px] font-medium text-violet-100 transition-colors hover:bg-violet-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Re-queue
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ol>
        )}
      </section>
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const cls = STATUS_STYLES[status] ?? STATUS_STYLES.queued;
  const label = STATUS_LABELS[status] ?? status;
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider ${cls}`}
    >
      {label}
    </span>
  );
}
