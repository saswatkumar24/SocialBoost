import Link from "next/link";
import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/auth";
import { getCreatorProfile } from "@/lib/creator-profile";
import { getLinkedinConnection } from "@/lib/linkedin-connection";

import ContentBoard from "./content-board";
import { pickTopics } from "./sample-topics";

export const metadata = {
  title: "Content suggestions — SocialBoost",
};

export default async function ContentSuggestionsPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/sign-in?next=/app/content");
  }

  const [profile, linkedinConnection] = await Promise.all([
    getCreatorProfile(user.id),
    getLinkedinConnection(user.id),
  ]);

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

  const hasProfile =
    !!profile && (profile.description.trim().length > 0 || profile.categories.length > 0);

  const initialSeed = hashSeed(user.id);
  const initialTopics = pickTopics(initialSeed, 6);

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-3">
        <p className="text-[11px] font-mono font-medium uppercase tracking-[0.2em] text-violet-300/80">
          Create · Content suggestions
        </p>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-[2.5rem]">
              Pick a post to write next.
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-zinc-400">
              A rotating board of LinkedIn topics, formats, and hooks. Hit
              <span className="mx-1 font-medium text-zinc-200">Load new set</span>
              for AI-generated ideas, then click
              <span className="mx-1 font-medium text-zinc-200">Draft post</span>
              on a card to have GPT-5.4 write it.
            </p>
          </div>

          {!hasProfile && (
            <Link
              href="/app/settings/preferences"
              className="inline-flex items-center gap-2 self-start rounded-xl border border-violet-400/30 bg-violet-500/10 px-3.5 py-2 text-sm font-medium text-violet-100 transition-colors hover:bg-violet-500/20 sm:self-auto"
            >
              <SparkleSmall />
              <span>Tune to your voice in Preferences</span>
            </Link>
          )}
        </div>
      </header>

      <ContentBoard
        initialTopics={initialTopics}
        hasLinkedinConnection={!!linkedinConnection}
      />
    </div>
  );
}

function SparkleSmall() {
  return (
    <svg className="h-3.5 w-3.5" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="M8 1.5l1.5 3.5 3.5 1.5-3.5 1.5L8 11.5 6.5 8 3 6.5 6.5 5 8 1.5z" />
    </svg>
  );
}

function hashSeed(value: string): number {
  let hash = 2166136261 >>> 0;
  for (let i = 0; i < value.length; i++) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 16777619) >>> 0;
  }
  return hash || 1;
}
