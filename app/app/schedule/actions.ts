"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

import { getCurrentUser } from "@/lib/auth";
import {
  cancelScheduledPost,
  getPostingScheduleOrDefault,
  insertScheduledPost,
  listTakenSlots,
  requeueFailedPost,
  upsertPostingSchedule,
} from "@/lib/scheduling";
import { ACCESS_COOKIE, createInsForgeServerClient } from "@/lib/insforge";
import { getCreatorProfile, upsertCreatorProfile } from "@/lib/creator-profile";
import { CONTENT_CATEGORIES } from "@/lib/creator-profile-shared";
import { draftPost, refinePostText } from "@/lib/ai-content";
import { computeNextSlot } from "@/lib/scheduling-slots";
import {
  isValidHHMM,
  isValidIanaTimezone,
  MAX_INTERVAL_HOURS,
  MAX_QUEUE_BODY,
  MAX_TIMES_OF_DAY,
  MIN_INTERVAL_HOURS,
  type PostingScheduleMode,
} from "@/lib/scheduling-shared";

function normalizeTimes(values: string[]): string[] {
  const cleaned = values
    .map((v) => v.trim())
    .filter((v) => isValidHHMM(v))
    .slice(0, MAX_TIMES_OF_DAY);
  return Array.from(new Set(cleaned)).sort((a, b) => a.localeCompare(b));
}

function normalizeDays(values: number[]): number[] {
  const seen = new Set<number>();
  for (const v of values) {
    if (Number.isInteger(v) && v >= 0 && v <= 6) seen.add(v);
  }
  return Array.from(seen).sort((a, b) => a - b);
}

// ---------------- Add to queue --------------------------------------------

export type AddToQueueInput = {
  body: string;
  topic_title?: string | null;
  topic_format?: string | null;
};

export type AddToQueueResult =
  | { ok: true; scheduledAt: string }
  | { ok: false; error: string; noActiveSchedule?: boolean };

export async function addToQueueAction(
  input: AddToQueueInput
): Promise<AddToQueueResult> {
  const user = await getCurrentUser();
  if (!user) {
    return { ok: false, error: "Your session has expired. Please sign in again." };
  }

  const body = (input?.body ?? "").trim();
  if (!body) return { ok: false, error: "The post is empty." };
  if (body.length > MAX_QUEUE_BODY) {
    return {
      ok: false,
      error: `Posts must be ${MAX_QUEUE_BODY.toLocaleString()} characters or fewer.`,
    };
  }

  const schedule = await getPostingScheduleOrDefault(user.id);
  if (!schedule.is_active) {
    return {
      ok: false,
      noActiveSchedule: true,
      error: "Your posting schedule is paused. Activate it to queue posts.",
    };
  }
  if (schedule.days_of_week.length === 0) {
    return {
      ok: false,
      noActiveSchedule: true,
      error: "Pick at least one day of the week in your posting schedule.",
    };
  }

  const taken = await listTakenSlots(user.id);
  const slot = computeNextSlot(schedule, taken, new Date());
  if (!slot) {
    return {
      ok: false,
      error: "No upcoming slots in the next 60 days for this schedule.",
    };
  }

  const insertResult = await insertScheduledPost(user.id, {
    body,
    scheduled_at: slot,
    topic_title: input.topic_title ?? null,
    topic_format: input.topic_format ?? null,
  });

  if (!insertResult.ok) {
    return { ok: false, error: insertResult.error };
  }

  revalidatePath("/app");
  revalidatePath("/app/schedule");

  return { ok: true, scheduledAt: insertResult.post.scheduled_at };
}

// ---------------- Cancel queued -------------------------------------------

export type CancelQueuedResult =
  | { ok: true }
  | { ok: false; error: string };

export async function cancelQueuedAction(id: string): Promise<CancelQueuedResult> {
  const user = await getCurrentUser();
  if (!user) {
    return { ok: false, error: "Your session has expired. Please sign in again." };
  }
  if (!id || typeof id !== "string") {
    return { ok: false, error: "Missing post id." };
  }

  const result = await cancelScheduledPost(user.id, id);
  if (!result.ok) return { ok: false, error: result.error };

  revalidatePath("/app");
  revalidatePath("/app/schedule");
  return { ok: true };
}

// ---------------- Re-queue failed -----------------------------------------

export type RequeueResult =
  | { ok: true; scheduledAt: string }
  | { ok: false; error: string };

export async function requeueFailedAction(id: string): Promise<RequeueResult> {
  const user = await getCurrentUser();
  if (!user) {
    return { ok: false, error: "Your session has expired. Please sign in again." };
  }
  if (!id || typeof id !== "string") {
    return { ok: false, error: "Missing post id." };
  }

  const schedule = await getPostingScheduleOrDefault(user.id);
  if (!schedule.is_active) {
    return { ok: false, error: "Your posting schedule is paused." };
  }
  const taken = await listTakenSlots(user.id);
  const slot = computeNextSlot(schedule, taken, new Date());
  if (!slot) {
    return { ok: false, error: "No upcoming slots available." };
  }

  const result = await requeueFailedPost(user.id, { id, scheduled_at: slot });
  if (!result.ok) return { ok: false, error: result.error };

  revalidatePath("/app");
  revalidatePath("/app/schedule");
  return { ok: true, scheduledAt: slot.toISOString() };
}

// ---------------- Update schedule -----------------------------------------

export type UpdateScheduleInput = {
  timezone: string;
  days_of_week: number[];
  mode: PostingScheduleMode;
  times_of_day: string[];
  interval_hours: number;
  interval_start_time: string;
  is_active: boolean;
};

export type UpdateScheduleResult =
  | { ok: true }
  | { ok: false; error: string };

export async function updatePostingScheduleAction(
  input: UpdateScheduleInput
): Promise<UpdateScheduleResult> {
  const user = await getCurrentUser();
  if (!user) {
    return { ok: false, error: "Your session has expired. Please sign in again." };
  }

  const tz = String(input?.timezone ?? "").trim() || "UTC";
  if (!isValidIanaTimezone(tz)) {
    return { ok: false, error: `Unknown timezone: ${tz}` };
  }

  const mode: PostingScheduleMode = input.mode === "interval" ? "interval" : "times";

  const days = normalizeDays(Array.isArray(input.days_of_week) ? input.days_of_week : []);
  if (days.length === 0) {
    return { ok: false, error: "Pick at least one day of the week." };
  }

  const times = normalizeTimes(Array.isArray(input.times_of_day) ? input.times_of_day : []);
  if (mode === "times" && times.length === 0) {
    return { ok: false, error: "Pick at least one time of day." };
  }

  let intervalHours = Number(input.interval_hours);
  if (!Number.isFinite(intervalHours)) intervalHours = 4;
  intervalHours = Math.max(MIN_INTERVAL_HOURS, Math.min(MAX_INTERVAL_HOURS, Math.floor(intervalHours)));

  const intervalStart = String(input.interval_start_time ?? "").trim();
  if (mode === "interval" && !isValidHHMM(intervalStart)) {
    return { ok: false, error: "Pick a valid interval start time (HH:MM)." };
  }

  const result = await upsertPostingSchedule(user.id, {
    timezone: tz,
    days_of_week: days,
    mode,
    times_of_day: times.length > 0 ? times : ["09:00"],
    interval_hours: intervalHours,
    interval_start_time: isValidHHMM(intervalStart) ? intervalStart : "09:00",
    is_active: !!input.is_active,
  });

  if (!result.ok) return { ok: false, error: result.error };

  revalidatePath("/app");
  revalidatePath("/app/schedule");
  return { ok: true };
}

// ---------------- Preview next slot ---------------------------------------

export type PreviewNextSlotResult = {
  scheduledAt: string | null;
  timezone: string;
};

export async function previewNextSlotAction(): Promise<PreviewNextSlotResult> {
  const user = await getCurrentUser();
  if (!user) return { scheduledAt: null, timezone: "UTC" };

  const schedule = await getPostingScheduleOrDefault(user.id);
  if (!schedule.is_active || schedule.days_of_week.length === 0) {
    return { scheduledAt: null, timezone: schedule.timezone };
  }
  const taken = await listTakenSlots(user.id);
  const slot = computeNextSlot(schedule, taken, new Date());
  return {
    scheduledAt: slot?.toISOString() ?? null,
    timezone: schedule.timezone,
  };
}

// ---------------- Helper functions for timezone date calculation ----------

function getTomorrowDateInTimezone(timezone: string): {
  dayOfWeek: number;
  year: number;
  month: number;
  day: number;
} {
  const now = new Date();
  const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23"
  }).formatToParts(tomorrow);
  
  const f: Record<string, string> = {};
  for (const p of parts) {
    if (p.type !== "literal") f[p.type] = p.value;
  }
  
  const y = Number(f.year);
  const m = Number(f.month);
  const d = Number(f.day);
  
  const dayOfWeekStr = new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    weekday: "short"
  }).format(tomorrow);
  
  const weekdayMap: Record<string, number> = {
    "Sun": 0, "Mon": 1, "Tue": 2, "Wed": 3, "Thu": 4, "Fri": 5, "Sat": 6
  };
  const dayOfWeek = weekdayMap[dayOfWeekStr] ?? 0;
  
  return { dayOfWeek, year: y, month: m, day: d };
}

function getSlotTimestamp(
  year: number,
  month: number,
  day: number,
  timeStr: string,
  timezone: string
): Date {
  const [hourStr, minStr] = timeStr.split(":");
  const h = Number(hourStr);
  const min = Number(minStr);
  
  const localISO = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}T${String(h).padStart(2, "0")}:${String(min).padStart(2, "0")}:00`;
  const utcGuess = new Date(localISO + "Z");
  
  const formattedParts = new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23"
  }).formatToParts(utcGuess);
  
  const f: Record<string, string> = {};
  for (const p of formattedParts) {
    if (p.type !== "literal") f[p.type] = p.value;
  }
  
  const guessLocal = Date.UTC(Number(f.year), Number(f.month) - 1, Number(f.day), Number(f.hour), Number(f.minute), Number(f.second));
  const targetLocal = Date.UTC(year, month - 1, day, h, min, 0);
  const diff = targetLocal - guessLocal;
  
  return new Date(utcGuess.getTime() + diff);
}

// ---------------- Standalone & Recurring actions --------------------------

function getNextWeekdaySlotTimestamp(
  targetDay: number,
  timeStr: string,
  timezone: string
): Date {
  const now = new Date();
  for (let offset = 0; offset <= 8; offset++) {
    const futureDate = new Date(now.getTime() + offset * 24 * 60 * 60 * 1000);
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone: timezone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      weekday: "short",
    }).formatToParts(futureDate);

    const f: Record<string, string> = {};
    for (const p of parts) {
      if (p.type !== "literal") f[p.type] = p.value;
    }

    const weekdayMap: Record<string, number> = {
      Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6,
    };
    const currentDayOfWeek = weekdayMap[f.weekday] ?? 0;

    if (currentDayOfWeek === targetDay) {
      const y = Number(f.year);
      const m = Number(f.month);
      const d = Number(f.day);

      const candidate = getSlotTimestamp(y, m, d, timeStr, timezone);
      if (candidate.getTime() > now.getTime()) {
        return candidate;
      }
    }
  }
  return new Date(now.getTime() + 24 * 60 * 60 * 1000);
}

export async function scheduleFixedMessageAction(input: {
  body: string;
  is_recurring: boolean;
  scheduled_at?: string;
  days_of_week?: number[];
  times_of_day?: string[];
}): Promise<{ ok: boolean; error?: string }> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: "Your session has expired. Please sign in again." };

  const body = (input.body ?? "").trim();
  if (!body) return { ok: false, error: "Post body cannot be empty." };
  if (body.length > MAX_QUEUE_BODY) {
    return { ok: false, error: `Post exceeds the ${MAX_QUEUE_BODY} character limit.` };
  }

  if (!input.is_recurring) {
    if (!input.scheduled_at) {
      return { ok: false, error: "Please pick a date and time." };
    }
    const scheduledAt = new Date(input.scheduled_at);
    if (Number.isNaN(scheduledAt.getTime()) || scheduledAt.getTime() <= Date.now()) {
      return { ok: false, error: "Please pick a valid date and time in the future." };
    }

    const res = await insertScheduledPost(user.id, {
      body,
      scheduled_at: scheduledAt,
      is_recurring: false,
      recurrence_interval_days: null,
    });

    if (!res.ok) return { ok: false, error: res.error };
  } else {
    const days = input.days_of_week ?? [];
    const times = input.times_of_day ?? [];

    if (days.length === 0) {
      return { ok: false, error: "Please pick at least one day of the week." };
    }
    if (times.length === 0) {
      return { ok: false, error: "Please pick at least one time of day." };
    }

    const schedule = await getPostingScheduleOrDefault(user.id);
    const timezone = schedule.timezone || "UTC";

    let inserted = 0;
    for (const d of days) {
      for (const t of times) {
        if (!isValidHHMM(t)) continue;
        const firstRun = getNextWeekdaySlotTimestamp(d, t, timezone);
        const res = await insertScheduledPost(user.id, {
          body,
          scheduled_at: firstRun,
          is_recurring: true,
          recurrence_interval_days: 7, // weekly recurrence
        });
        if (res.ok) {
          inserted++;
        }
      }
    }

    if (inserted === 0) {
      return { ok: false, error: "Failed to schedule any recurring posts." };
    }
  }

  revalidatePath("/app");
  revalidatePath("/app/schedule");
  return { ok: true };
}

export async function updateProfileCategoriesAction(
  categories: string[]
): Promise<{ ok: boolean; error?: string }> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: "Not authenticated" };

  const profile = await getCreatorProfile(user.id);
  const description = profile?.description ?? "";
  const target_audience = profile?.target_audience ?? null;
  const tone = profile?.tone ?? null;

  const result = await upsertCreatorProfile(user.id, {
    description,
    categories,
    target_audience,
    tone,
  });

  if (result.ok) {
    revalidatePath("/app");
    revalidatePath("/app/schedule");
    revalidatePath("/app/content");
  }

  return result;
}

// ---------------- AI Autopilot actions ------------------------------------

export async function getAiTopicSchedulesAction(): Promise<{
  ok: boolean;
  schedules: any[];
  error?: string;
}> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, schedules: [], error: "Not authenticated" };

  const cookieStore = await cookies();
  const token = cookieStore.get(ACCESS_COOKIE)?.value;
  if (!token) return { ok: false, schedules: [], error: "Not authenticated" };
  const insforge = createInsForgeServerClient(token);

  const { data, error } = await insforge.database
    .from("ai_topic_schedules")
    .select()
    .eq("user_id", user.id);

  if (error) return { ok: false, schedules: [], error: error.message };
  return { ok: true, schedules: data ?? [] };
}

export async function saveAiTopicScheduleAction(input: {
  id?: string;
  topic_name: string;
  prompt_brief: string;
  slots: Array<{ day: number; time: string }>;
  is_active?: boolean;
}): Promise<{ ok: boolean; error?: string }> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: "Not authenticated" };

  const topicName = (input.topic_name ?? "").trim();
  const promptBrief = (input.prompt_brief ?? "").trim();
  if (!topicName || !promptBrief) {
    return { ok: false, error: "Topic name and prompt brief are required." };
  }

  if (input.slots.length > 4) {
    return { ok: false, error: "You can post a maximum of 4 times a week for each topic." };
  }

  const cookieStore = await cookies();
  const token = cookieStore.get(ACCESS_COOKIE)?.value;
  if (!token) return { ok: false, error: "Not authenticated" };
  const insforge = createInsForgeServerClient(token);

  const isCategory = CONTENT_CATEGORIES.includes(topicName as any);
  if (!isCategory) {
    const { data: existing, error: err } = await insforge.database
      .from("ai_topic_schedules")
      .select("id, topic_name")
      .eq("user_id", user.id);
    if (err) return { ok: false, error: err.message };

    const customCount = (existing ?? []).filter(
      (s: any) => !CONTENT_CATEGORIES.includes(s.topic_name as any)
    ).length;

    let isNewCustom = true;
    if (input.id) {
      const oldSchedule = (existing ?? []).find((s: any) => s.id === input.id);
      if (oldSchedule && !CONTENT_CATEGORIES.includes(oldSchedule.topic_name as any)) {
        isNewCustom = false;
      }
    }

    if (isNewCustom && customCount >= 2) {
      return {
        ok: false,
        error: "Limit reached: You can configure a maximum of 2 custom interest topics. Contact support to add more.",
      };
    }
  }

  if (!input.id) {
    const { data: existingCount, error: countErr } = await insforge.database
      .from("ai_topic_schedules")
      .select("id")
      .eq("user_id", user.id);
    if (countErr) return { ok: false, error: countErr.message };
    if (existingCount && existingCount.length >= 7) {
      return { ok: false, error: "You can select a maximum of 7 interests/topics." };
    }
  }

  const payload = {
    user_id: user.id,
    topic_name: topicName,
    prompt_brief: promptBrief,
    slots: input.slots,
    is_active: input.is_active ?? true,
    updated_at: new Date().toISOString(),
  };

  if (input.id) {
    const { error } = await insforge.database
      .from("ai_topic_schedules")
      .update(payload)
      .eq("id", input.id)
      .eq("user_id", user.id);
    if (error) return { ok: false, error: error.message };
  } else {
    const { error } = await insforge.database
      .from("ai_topic_schedules")
      .insert([payload]);
    if (error) return { ok: false, error: error.message };
  }

  revalidatePath("/app/schedule");
  return { ok: true };
}

export async function deleteAiTopicScheduleAction(id: string): Promise<{
  ok: boolean;
  error?: string;
}> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: "Not authenticated" };

  const cookieStore = await cookies();
  const token = cookieStore.get(ACCESS_COOKIE)?.value;
  if (!token) return { ok: false, error: "Not authenticated" };
  const insforge = createInsForgeServerClient(token);

  const { error } = await insforge.database
    .from("ai_topic_schedules")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) return { ok: false, error: error.message };

  revalidatePath("/app/schedule");
  return { ok: true };
}

export async function generateTomorrowAiPostsAction(): Promise<{
  ok: boolean;
  count: number;
  error?: string;
}> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, count: 0, error: "Your session has expired. Please sign in again." };

  const schedule = await getPostingScheduleOrDefault(user.id);
  const timezone = schedule.timezone || "UTC";

  const tomorrow = getTomorrowDateInTimezone(timezone);

  const cookieStore = await cookies();
  const token = cookieStore.get(ACCESS_COOKIE)?.value;
  if (!token) return { ok: false, count: 0, error: "Not authenticated" };
  const insforge = createInsForgeServerClient(token);

  const { data: topicSchedules, error: topicError } = await insforge.database
    .from("ai_topic_schedules")
    .select()
    .eq("user_id", user.id)
    .eq("is_active", true);

  if (topicError) {
    return { ok: false, count: 0, error: topicError.message };
  }

  if (!topicSchedules || topicSchedules.length === 0) {
    return { ok: true, count: 0, error: "You don't have any active AI topic schedules. Please configure some first." };
  }

  const profile = await getCreatorProfile(user.id);

  let generatedCount = 0;

  for (const topic of topicSchedules) {
    const slots = Array.isArray(topic.slots) ? topic.slots : [];
    const tomorrowSlots = slots.filter((s: any) => Number(s.day) === tomorrow.dayOfWeek);

    for (const slot of tomorrowSlots) {
      const scheduledTime = getSlotTimestamp(tomorrow.year, tomorrow.month, tomorrow.day, slot.time, timezone);

      const { data: existing } = await insforge.database
        .from("scheduled_posts")
        .select("id")
        .eq("user_id", user.id)
        .eq("scheduled_at", scheduledTime.toISOString())
        .eq("topic_title", topic.topic_name)
        .maybeSingle();

      if (existing) {
        continue;
      }

      const aiResult = await draftPost(profile, {
        title: topic.topic_name,
        angle: topic.prompt_brief,
        hook: "",
        format: "story",
      });

      if (aiResult.error || !aiResult.body) {
        console.error(`AI generation failed for topic ${topic.topic_name}:`, aiResult.error);
        continue;
      }

      const insertRes = await insertScheduledPost(user.id, {
        body: aiResult.body,
        scheduled_at: scheduledTime,
        topic_title: topic.topic_name,
        topic_format: "story",
      });

      if (insertRes.ok) {
        generatedCount++;
      }
    }
  }

  revalidatePath("/app");
  revalidatePath("/app/schedule");

  return { ok: true, count: generatedCount };
}

export type RefinePostActionResult = {
  ok: boolean;
  body?: string;
  error?: string;
};

export async function refinePostAction(text: string): Promise<RefinePostActionResult> {
  const user = await getCurrentUser();
  if (!user) {
    return { ok: false, error: "Your session has expired. Please sign in again." };
  }

  const cleaned = (text ?? "").trim();
  if (!cleaned) {
    return { ok: false, error: "The text to refine cannot be empty." };
  }

  const profile = await getCreatorProfile(user.id);
  const res = await refinePostText(profile, cleaned);

  if (res.error) {
    return { ok: false, error: res.error };
  }

  return { ok: true, body: res.body };
}

