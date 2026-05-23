import Link from "next/link";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

import { getCurrentUser } from "@/lib/auth";
import { getLinkedinConnection } from "@/lib/linkedin-connection";
import {
  getPostingScheduleOrDefault,
  listScheduledPosts,
  listTakenSlots,
} from "@/lib/scheduling";
import { computeNextSlot } from "@/lib/scheduling-slots";
import { ACCESS_COOKIE, createInsForgeServerClient } from "@/lib/insforge";

import { getCreatorProfile } from "@/lib/creator-profile";
import Composer from "./_components/composer";
import QueueBoard from "./_components/queue-board";

export const metadata = {
  title: "Schedule — SocialBoost",
};

// Fetch user-defined AI topic schedules from database
async function getAiTopicSchedules(userId: string) {
  const cookieStore = await cookies();
  const token = cookieStore.get(ACCESS_COOKIE)?.value;
  if (!token) return [];
  
  try {
    const insforge = createInsForgeServerClient(token);
    const { data, error } = await insforge.database
      .from("ai_topic_schedules")
      .select()
      .eq("user_id", userId);
      
    if (error) {
      console.error("Failed to load topic schedules:", error);
      return [];
    }
    return data ?? [];
  } catch (err) {
    console.error("Failed to load topic schedules:", err);
    return [];
  }
}

export default async function SchedulePage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/sign-in?next=/app/schedule");
  }

  const linkedinConnection = await getLinkedinConnection(user.id);

  // Compulsory LinkedIn Connection Block
  if (!linkedinConnection) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6 space-y-6">
        <div className="relative overflow-hidden rounded-2xl border border-rose-500/20 bg-rose-500/[0.02] p-8 max-w-xl backdrop-blur-xl">
          <div aria-hidden className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-rose-500/10 blur-3xl" />
          <div className="flex flex-col items-center space-y-4 relative">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 shadow-lg shadow-rose-500/5 animate-pulse">
              <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold text-white">Connection Required</h2>
              <p className="text-sm text-zinc-400 leading-relaxed">
                LinkedIn connection is compulsory. Please connect your LinkedIn profile first to write, schedule, or view posts.
              </p>
            </div>
            <a
              href="/api/linkedin/connect"
              className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-violet-500 via-fuchsia-500 to-cyan-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-500/30 transition-all hover:shadow-fuchsia-500/40"
            >
              <span className="relative z-10 inline-flex items-center gap-2">
                Connect your LinkedIn profile
                <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8h10m0 0L9 4m4 4l-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <span
                aria-hidden
                className="absolute inset-0 -z-0 bg-gradient-to-r from-fuchsia-500 via-violet-500 to-violet-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              />
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Load schedule and post listings
  const [schedule, queued, history, aiTopicSchedules, creatorProfile] = await Promise.all([
    getPostingScheduleOrDefault(user.id),
    listScheduledPosts(user.id, {
      statuses: ["queued", "publishing"],
      limit: 100,
      order: "asc",
    }),
    listScheduledPosts(user.id, {
      statuses: ["published", "failed", "cancelled"],
      limit: 20,
      order: "desc",
    }),
    getAiTopicSchedules(user.id),
    getCreatorProfile(user.id),
  ]);

  const taken = await listTakenSlots(user.id);
  const previewSlot =
    schedule.is_active && schedule.days_of_week.length > 0
      ? computeNextSlot(schedule, taken, new Date())
      : null;

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <header className="flex flex-col gap-3">
        <p className="text-[11px] font-mono font-medium uppercase tracking-[0.2em] text-violet-300/80">
          Create · Schedule
        </p>
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-[2.5rem]">
            Queue posts. Ship on autopilot.
          </h1>
          <p className="mt-2 text-sm text-zinc-400">
            Write standalone updates, schedule recurring announcements, or let AI generate posts for your autopilot interests.
          </p>
        </div>
      </header>

      <Composer
        hasLinkedinConnection={true}
        scheduleActive={schedule.is_active && schedule.days_of_week.length > 0}
        timezone={schedule.timezone}
        previewSlot={previewSlot ? previewSlot.toISOString() : null}
        aiTopicSchedules={aiTopicSchedules}
        creatorProfile={creatorProfile}
      />

      <section className="space-y-6">
        <QueueBoard
          initialQueued={queued}
          initialHistory={history}
          timezone={schedule.timezone}
          aiTopicSchedules={aiTopicSchedules}
        />
      </section>
    </div>
  );
}
