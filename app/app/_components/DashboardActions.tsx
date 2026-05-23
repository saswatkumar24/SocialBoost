"use client";

import { useState } from "react";
import useRouter from "next/navigation";
import Link from "next/link";
import DirectPostForm from "./DirectPostForm";

type DashboardActionsProps = {
  linkedinConnected: boolean;
  queuedCount: number;
  profileComplete: boolean;
  profileCategories: string[];
};

export default function DashboardActions({
  linkedinConnected,
  queuedCount,
  profileComplete,
  profileCategories,
}: DashboardActionsProps) {
  const [warningMsg, setWarningMsg] = useState<string | null>(null);

  const handleRestrictedClick = (e: React.MouseEvent, dest: string, label: string) => {
    if (!linkedinConnected) {
      e.preventDefault();
      setWarningMsg(`Please connect your LinkedIn profile first to access ${label}.`);
      setTimeout(() => setWarningMsg(null), 4000);
    }
  };

  return (
    <div className="space-y-6 relative">
      {/* Floating Warning Toast */}
      {warningMsg && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl border border-rose-500/30 bg-zinc-900/90 p-4 text-sm font-medium text-rose-200 shadow-2xl backdrop-blur-xl transition-all duration-300 animate-in fade-in slide-in-from-bottom-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-rose-500/20 text-rose-400">
            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <span>{warningMsg}</span>
          <button onClick={() => setWarningMsg(null)} className="ml-2 text-zinc-400 hover:text-white">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* Card 1: Direct Posting (handles its own warning check but integrated here) */}
        <DirectPostForm linkedinConnected={linkedinConnected} />

        {/* Card 2: Autopilot Scheduler */}
        <div className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-zinc-900/40 p-6 backdrop-blur-xl transition-all hover:border-white/[0.1]">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"
          />
          <div className="flex flex-col justify-between h-full gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full border border-violet-400/30 bg-violet-500/10 px-2.5 py-1 text-[11px] font-medium text-violet-200">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-violet-300" />
                </span>
                Autopilot & Queue
              </div>
              <h3 className="mt-3 text-lg font-semibold text-white">Scheduled posting queue</h3>
              <p className="mt-1.5 text-sm text-zinc-400">
                Manage your weekly publication cadence, intervals, timezones, and see posts waiting to publish.
              </p>
            </div>
            <Link
              href="/app/schedule"
              onClick={(e) => handleRestrictedClick(e, "/app/schedule", "Posting Schedule")}
              className="group relative inline-flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl border border-white/10 bg-white/5 py-2.5 text-sm font-semibold text-zinc-200 transition-all hover:bg-white/10 hover:text-white"
            >
              <span>Manage schedule ({queuedCount})</span>
              <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10m0 0L9 4m4 4l-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Card 3: AI Suggestions Board */}
        <div className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-zinc-900/40 p-6 backdrop-blur-xl transition-all hover:border-white/[0.1]">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"
          />
          <div className="flex flex-col justify-between h-full gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full border border-fuchsia-400/30 bg-fuchsia-500/10 px-2.5 py-1 text-[11px] font-medium text-fuchsia-200">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-fuchsia-300" />
                </span>
                AI Ideation
              </div>
              <h3 className="mt-3 text-lg font-semibold text-white">Browse content suggestions</h3>
              <p className="mt-1.5 text-sm text-zinc-400">
                A live dashboard of AI-generated LinkedIn topics, angles, hooks, and drafts tailored to your preferences.
              </p>
            </div>
            <Link
              href="/app/content"
              onClick={(e) => handleRestrictedClick(e, "/app/content", "Content Suggestions")}
              className="group relative inline-flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl border border-white/10 bg-white/5 py-2.5 text-sm font-semibold text-zinc-200 transition-all hover:bg-white/10 hover:text-white"
            >
              <span>Explore suggestions</span>
              <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10m0 0L9 4m4 4l-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      {/* Card 4: Creator Preferences (Optional, always accessible so users can configure profile before connecting, but flagged beautifully) */}
      <div className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-zinc-900/40 p-6 backdrop-blur-xl transition-all hover:border-white/[0.1]">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"
        />
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <h3 className="text-lg font-semibold text-white">Creator voice & preferences</h3>
            <p className="text-sm text-zinc-400 max-w-2xl">
              Configure your description, tone, target audience, and content categories. AI suggestion algorithms use this voice configuration to make suggestions.
            </p>
            {profileComplete && profileCategories.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5 pt-1">
                {profileCategories.map((cat) => (
                  <span key={cat} className="inline-flex items-center rounded-full border border-zinc-700 bg-zinc-800 px-2 py-0.5 text-xs text-zinc-300">
                    {cat}
                  </span>
                ))}
              </div>
            )}
          </div>
          <Link
            href="/app/settings/preferences"
            className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-zinc-950 transition-all hover:bg-zinc-200"
          >
            <span>{profileComplete ? "Update preferences" : "Set preferences"}</span>
            <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none">
              <path d="M3 8h10m0 0L9 4m4 4l-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
