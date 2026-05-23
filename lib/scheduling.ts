import "server-only";

import { cache } from "react";
import { cookies } from "next/headers";

import { ACCESS_COOKIE, createInsForgeServerClient } from "./insforge";
import {
  DEFAULT_POSTING_SCHEDULE,
  type PostingSchedule,
  type PostingScheduleMode,
  type ScheduledPost,
  type ScheduledPostStatus,
} from "./scheduling-shared";

async function getAuthedClient() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(ACCESS_COOKIE)?.value;
  if (!accessToken) return null;
  return createInsForgeServerClient(accessToken);
}

function rowToSchedule(row: Record<string, unknown>): PostingSchedule {
  const daysRaw = row.days_of_week;
  const timesRaw = row.times_of_day;
  return {
    user_id: row.user_id as string,
    timezone: (row.timezone as string) || "UTC",
    days_of_week: Array.isArray(daysRaw)
      ? (daysRaw as number[]).map((d) => Number(d)).filter((d) => d >= 0 && d <= 6)
      : [],
    mode:
      ((row.mode as string) === "interval" ? "interval" : "times") as PostingScheduleMode,
    times_of_day: Array.isArray(timesRaw) ? (timesRaw as string[]) : [],
    interval_hours: Number(row.interval_hours) || 4,
    interval_start_time: (row.interval_start_time as string) || "09:00",
    is_active: (row.is_active as boolean) ?? true,
    created_at: row.created_at as string,
    updated_at: row.updated_at as string,
  };
}

function rowToScheduledPost(row: Record<string, unknown>): ScheduledPost {
  return {
    id: row.id as string,
    user_id: row.user_id as string,
    body: (row.body as string) ?? "",
    status: ((row.status as string) || "queued") as ScheduledPostStatus,
    scheduled_at: row.scheduled_at as string,
    published_at: (row.published_at as string | null) ?? null,
    post_urn: (row.post_urn as string | null) ?? null,
    error_message: (row.error_message as string | null) ?? null,
    attempts: Number(row.attempts) || 0,
    topic_title: (row.topic_title as string | null) ?? null,
    topic_format: (row.topic_format as string | null) ?? null,
    created_at: row.created_at as string,
    updated_at: row.updated_at as string,
    is_recurring: (row.is_recurring as boolean) ?? false,
    recurrence_interval_days: (row.recurrence_interval_days as number | null) ?? null,
  };
}

export const getPostingSchedule = cache(
  async (userId: string): Promise<PostingSchedule | null> => {
    const insforge = await getAuthedClient();
    if (!insforge) return null;
    const { data, error } = await insforge.database
      .from("posting_schedules")
      .select()
      .eq("user_id", userId)
      .maybeSingle();
    if (error) {
      console.error("Failed to load posting_schedule", error);
      return null;
    }
    if (!data) return null;
    return rowToSchedule(data as Record<string, unknown>);
  }
);

// Returns the user's schedule, falling back to the in-memory default. Useful
// for UIs that should always show *something* without forcing a write.
export async function getPostingScheduleOrDefault(
  userId: string
): Promise<PostingSchedule> {
  const existing = await getPostingSchedule(userId);
  if (existing) return existing;
  const nowIso = new Date().toISOString();
  return {
    user_id: userId,
    ...DEFAULT_POSTING_SCHEDULE,
    created_at: nowIso,
    updated_at: nowIso,
  };
}

export type UpsertPostingScheduleInput = {
  timezone: string;
  days_of_week: number[];
  mode: PostingScheduleMode;
  times_of_day: string[];
  interval_hours: number;
  interval_start_time: string;
  is_active: boolean;
};

export async function upsertPostingSchedule(
  userId: string,
  input: UpsertPostingScheduleInput
): Promise<{ ok: true } | { ok: false; error: string }> {
  const insforge = await getAuthedClient();
  if (!insforge) return { ok: false, error: "Not authenticated" };

  const existing = await insforge.database
    .from("posting_schedules")
    .select("user_id")
    .eq("user_id", userId)
    .maybeSingle();

  if (existing.error) return { ok: false, error: existing.error.message };

  const payload = {
    timezone: input.timezone,
    days_of_week: input.days_of_week,
    mode: input.mode,
    times_of_day: input.times_of_day,
    interval_hours: input.interval_hours,
    interval_start_time: input.interval_start_time,
    is_active: input.is_active,
    updated_at: new Date().toISOString(),
  };

  if (existing.data) {
    const { error } = await insforge.database
      .from("posting_schedules")
      .update(payload)
      .eq("user_id", userId);
    if (error) return { ok: false, error: error.message };
    return { ok: true };
  }

  const { error } = await insforge.database.from("posting_schedules").insert([
    { user_id: userId, ...payload },
  ]);
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

export type ListScheduledPostsOptions = {
  statuses?: ScheduledPostStatus[];
  limit?: number;
  // Order: defaults to scheduled_at ascending for queued; descending makes
  // sense for history.
  order?: "asc" | "desc";
};

export async function listScheduledPosts(
  userId: string,
  options: ListScheduledPostsOptions = {}
): Promise<ScheduledPost[]> {
  const insforge = await getAuthedClient();
  if (!insforge) return [];
  const { statuses, limit = 100, order = "asc" } = options;

  let query = insforge.database
    .from("scheduled_posts")
    .select()
    .eq("user_id", userId);

  if (statuses && statuses.length > 0) {
    query = query.in("status", statuses);
  }

  query = query.order("scheduled_at", { ascending: order === "asc" }).limit(limit);

  const { data, error } = await query;
  if (error) {
    console.error("Failed to list scheduled_posts", error);
    return [];
  }
  return (data ?? []).map((row) => rowToScheduledPost(row as Record<string, unknown>));
}

export async function listTakenSlots(userId: string): Promise<Date[]> {
  const insforge = await getAuthedClient();
  if (!insforge) return [];
  const { data, error } = await insforge.database
    .from("scheduled_posts")
    .select("scheduled_at, status")
    .eq("user_id", userId)
    .in("status", ["queued", "publishing"]);
  if (error) return [];
  return (data ?? [])
    .map((row) => new Date((row as Record<string, unknown>).scheduled_at as string))
    .filter((d) => !Number.isNaN(d.getTime()));
}

export async function countQueuedPosts(userId: string): Promise<number> {
  const insforge = await getAuthedClient();
  if (!insforge) return 0;
  const { data, error } = await insforge.database
    .from("scheduled_posts")
    .select("id")
    .eq("user_id", userId)
    .eq("status", "queued");
  if (error) return 0;
  return (data ?? []).length;
}

export type InsertScheduledPostInput = {
  body: string;
  scheduled_at: Date;
  topic_title?: string | null;
  topic_format?: string | null;
  is_recurring?: boolean;
  recurrence_interval_days?: number | null;
};

export async function insertScheduledPost(
  userId: string,
  input: InsertScheduledPostInput
): Promise<{ ok: true; post: ScheduledPost } | { ok: false; error: string }> {
  const insforge = await getAuthedClient();
  if (!insforge) return { ok: false, error: "Not authenticated" };

  const { data, error } = await insforge.database
    .from("scheduled_posts")
    .insert([
      {
        user_id: userId,
        body: input.body,
        status: "queued" as ScheduledPostStatus,
        scheduled_at: input.scheduled_at.toISOString(),
        topic_title: input.topic_title ?? null,
        topic_format: input.topic_format ?? null,
        is_recurring: input.is_recurring ?? false,
        recurrence_interval_days: input.recurrence_interval_days ?? null,
      },
    ])
    .select()
    .single();

  if (error || !data) {
    return { ok: false, error: error?.message ?? "Could not save the post." };
  }

  return { ok: true, post: rowToScheduledPost(data as Record<string, unknown>) };
}

export async function cancelScheduledPost(
  userId: string,
  id: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  const insforge = await getAuthedClient();
  if (!insforge) return { ok: false, error: "Not authenticated" };

  const { error } = await insforge.database
    .from("scheduled_posts")
    .update({ status: "cancelled", updated_at: new Date().toISOString() })
    .eq("user_id", userId)
    .eq("id", id)
    .eq("status", "queued");

  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

export type RequeueInput = {
  id: string;
  scheduled_at: Date;
};

export async function requeueFailedPost(
  userId: string,
  input: RequeueInput
): Promise<{ ok: true } | { ok: false; error: string }> {
  const insforge = await getAuthedClient();
  if (!insforge) return { ok: false, error: "Not authenticated" };

  const { error } = await insforge.database
    .from("scheduled_posts")
    .update({
      status: "queued",
      scheduled_at: input.scheduled_at.toISOString(),
      attempts: 0,
      error_message: null,
      updated_at: new Date().toISOString(),
    })
    .eq("user_id", userId)
    .eq("id", input.id)
    .eq("status", "failed");

  if (error) return { ok: false, error: error.message };
  return { ok: true };
}
