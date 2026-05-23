"use client";

import { useState, useTransition } from "react";

import type { TopicSuggestion } from "@/lib/creator-profile-shared";

import { loadTopicsAction } from "./actions";
import DraftDrawer from "./draft-drawer";
import { type SampleTopic, SPOTLIGHT_TEMPLATES } from "./sample-topics";

const FORMAT_LABELS: Record<string, string> = {
  story: "Story",
  "tactical-list": "Tactical list",
  "contrarian-take": "Contrarian take",
  "case-study": "Case study",
  framework: "Framework",
  "data-drop": "Data drop",
};

const FORMAT_ACCENTS: Record<string, string> = {
  story: "from-violet-500/30 to-fuchsia-500/20 text-violet-200 border-violet-400/30",
  "tactical-list":
    "from-cyan-500/25 to-blue-500/15 text-cyan-200 border-cyan-400/30",
  "contrarian-take":
    "from-rose-500/25 to-orange-500/15 text-rose-200 border-rose-400/30",
  "case-study":
    "from-emerald-500/25 to-teal-500/15 text-emerald-200 border-emerald-400/30",
  framework:
    "from-amber-500/25 to-yellow-500/15 text-amber-200 border-amber-400/30",
  "data-drop":
    "from-indigo-500/25 to-violet-500/15 text-indigo-200 border-indigo-400/30",
};

function defaultAccent() {
  return FORMAT_ACCENTS.story;
}

type BoardTopic = TopicSuggestion & { category?: string };

type ContentBoardProps = {
  initialTopics: SampleTopic[];
  hasLinkedinConnection: boolean;
};

export default function ContentBoard({
  initialTopics,
  hasLinkedinConnection,
}: ContentBoardProps) {
  const [topics, setTopics] = useState<BoardTopic[]>(initialTopics);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [usedAi, setUsedAi] = useState(false);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeTopic, setActiveTopic] = useState<BoardTopic | null>(null);

  const [customTopicInput, setCustomTopicInput] = useState("");
  const [customDetailsInput, setCustomDetailsInput] = useState("");
  const [customError, setCustomError] = useState<string | null>(null);

  function handleGenerateCustom() {
    setCustomError(null);
    const topic = customTopicInput.trim();
    const details = customDetailsInput.trim();

    if (!topic) {
      setCustomError("Please enter a topic for the post.");
      return;
    }

    const customTopic: BoardTopic = {
      title: topic,
      angle: details,
      format: "story",
      hook: "",
      category: "Custom",
    };

    openDraft(customTopic);
  }

  function loadNewSet() {
    setError(null);
    startTransition(async () => {
      const result = await loadTopicsAction();
      if (result.error) {
        setError(result.error);
        return;
      }
      if (result.topics.length > 0) {
        setTopics(result.topics);
        setUsedAi(true);
      }
    });
  }

  function openDraft(topic: BoardTopic) {
    setActiveTopic(topic);
    setDrawerOpen(true);
  }

  return (
    <div className="space-y-8">
      {/* Custom AI Post Writer */}
      <div className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-zinc-900/40 p-6 backdrop-blur-xl">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-gradient-to-br from-violet-500/10 via-cyan-500/5 to-transparent blur-3xl"
        />
        <div className="relative flex flex-col gap-4">
          <div>
            <div className="text-[11px] font-mono font-medium uppercase tracking-[0.2em] text-violet-300/80">
              Custom Creator
            </div>
            <h2 className="mt-1 text-xl font-semibold text-white">
              Write a Custom AI Post
            </h2>
            <p className="mt-1 text-sm text-zinc-400">
              Define your own topic and details. Our AI will write a custom post formatted specifically for LinkedIn (including hashtags).
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="block text-xs font-mono uppercase tracking-wider text-zinc-500">
                Post Topic
              </label>
              <input
                type="text"
                value={customTopicInput}
                onChange={(e) => setCustomTopicInput(e.target.value)}
                placeholder="e.g. Scaling my engineering team from 1 to 10"
                className="w-full rounded-xl border border-white/[0.08] bg-zinc-950/60 px-4 py-2.5 text-sm text-white focus:outline-none focus:border-violet-500 transition-colors placeholder:text-zinc-600"
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-xs font-mono uppercase tracking-wider text-zinc-500">
                Key Details / Context
              </label>
              <textarea
                value={customDetailsInput}
                onChange={(e) => setCustomDetailsInput(e.target.value)}
                placeholder="e.g. Focus on lessons learned, scaling problems, and RTO vs Remote debate. Keep it conversational."
                rows={2}
                className="w-full rounded-xl border border-white/[0.08] bg-zinc-950/60 px-4 py-2.5 text-sm text-white focus:outline-none focus:border-violet-500 transition-colors placeholder:text-zinc-600"
              />
            </div>
          </div>

          {customError && (
            <p className="text-xs text-rose-300">⚠️ {customError}</p>
          )}

          <div className="flex justify-end pt-1">
            <button
              type="button"
              onClick={handleGenerateCustom}
              className="group relative inline-flex items-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-violet-500 via-fuchsia-500 to-cyan-500 px-4.5 py-2 text-xs font-semibold text-white shadow-lg transition-all hover:opacity-95"
            >
              <span className="relative z-10 inline-flex items-center gap-2">
                <svg className="h-3.5 w-3.5" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M8 1.5l1.5 3.5 3.5 1.5-3.5 1.5L8 11.5 6.5 8 3 6.5 6.5 5 8 1.5z" />
                </svg>
                <span>AI Generate Post</span>
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* LinkedIn Spotlight Templates */}
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold text-white">LinkedIn Spotlight Templates</h2>
          <p className="text-sm text-zinc-400">
            Proven templates designed specifically for high engagement on LinkedIn. Click a card to draft it instantly.
          </p>
        </div>
        <ol className="grid gap-4 md:grid-cols-2">
          {SPOTLIGHT_TEMPLATES.map((topic, idx) => {
            const accent = FORMAT_ACCENTS[topic.format] ?? defaultAccent();
            const formatLabel = FORMAT_LABELS[topic.format] ?? "Post";
            return (
              <li
                key={`spotlight-${topic.title}-${idx}`}
                className="group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-zinc-900/40 p-5 backdrop-blur-xl transition-all hover:border-white/10 hover:bg-zinc-900/60"
              >
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-white/15 to-transparent"
                />
                <div
                  aria-hidden
                  className="pointer-events-none absolute -right-16 -bottom-16 h-44 w-44 rounded-full bg-gradient-to-br from-violet-500/[0.05] to-fuchsia-500/[0.05] opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100"
                />

                <div className="relative flex items-center justify-between gap-2">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full border bg-gradient-to-r px-2.5 py-0.5 text-[11px] font-medium tracking-wide ${accent}`}
                  >
                    {formatLabel}
                  </span>
                  {topic.category && (
                    <span className="font-mono text-[11px] uppercase tracking-wider text-zinc-500">
                      {topic.category}
                    </span>
                  )}
                </div>

                <h3 className="relative mt-3 text-base font-semibold leading-snug text-white">
                  {topic.title}
                </h3>

                {topic.angle && (
                  <p className="relative mt-2 text-sm text-zinc-400">{topic.angle}</p>
                )}

                {topic.hook && (
                  <div className="relative mt-3 rounded-xl border border-white/[0.06] bg-zinc-950/60 px-3 py-2.5 text-sm italic text-zinc-200">
                    <span className="select-none text-zinc-500">&ldquo;</span>
                    {topic.hook}
                    <span className="select-none text-zinc-500">&rdquo;</span>
                  </div>
                )}

                <div className="relative mt-4 flex items-center gap-2 opacity-80 transition-opacity group-hover:opacity-100">
                  <button
                    type="button"
                    onClick={() => openDraft(topic)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-xs font-medium text-zinc-100 transition-colors hover:bg-white/10"
                  >
                    <PencilIcon />
                    <span>Draft template post</span>
                  </button>
                </div>
              </li>
            );
          })}
        </ol>
      </div>

      {/* Rotating board of suggestions */}
      <div className="space-y-4">
        <div className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-zinc-900/40 p-6 backdrop-blur-xl">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-gradient-to-br from-violet-500/30 via-fuchsia-500/20 to-transparent blur-3xl"
          />
          <div className="relative flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-xl">
              <div className="text-[11px] font-mono font-medium uppercase tracking-[0.2em] text-violet-300/80">
                Idea library
              </div>
              <h2 className="mt-1 text-xl font-semibold text-white">
                Rotating Suggestions Board
              </h2>
              <p className="mt-1 text-sm text-zinc-400">
                Tap <span className="font-medium text-zinc-200">Load new set</span> to have GPT-5.4 generate six fresh
                LinkedIn topics tuned to your profile. Click <span className="font-medium text-zinc-200">Draft post</span>{" "}
                on any card to write the full post.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={loadNewSet}
                disabled={pending}
                className="group relative inline-flex items-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-violet-500 via-fuchsia-500 to-cyan-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-500/30 transition-all hover:shadow-fuchsia-500/40 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <span className="relative z-10 inline-flex items-center gap-2">
                  {pending ? <Spinner /> : <SparkleIcon />}
                  <span>{pending ? "Generating with AI…" : "Load new set"}</span>
                </span>
                <span
                  aria-hidden
                  className="absolute inset-0 -z-0 bg-gradient-to-r from-fuchsia-500 via-violet-500 to-violet-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                />
              </button>
            </div>
          </div>

          {error && (
            <p className="relative mt-4 inline-flex items-center gap-1.5 rounded-lg border border-rose-400/30 bg-rose-500/10 px-3 py-1.5 text-xs text-rose-100">
              <span className="h-1.5 w-1.5 rounded-full bg-rose-300" />
              {error}
            </p>
          )}

          {!error && usedAi && (
            <p className="relative mt-4 inline-flex items-center gap-1.5 rounded-lg border border-fuchsia-400/30 bg-fuchsia-500/10 px-3 py-1.5 text-xs text-fuchsia-200">
              <span className="h-1.5 w-1.5 rounded-full bg-fuchsia-300" />
              Generated by GPT-5.4 via the InsForge AI Gateway, tuned to your saved
              preferences.
            </p>
          )}
        </div>

        <ol className="grid gap-4 md:grid-cols-2">
          {topics.map((topic, idx) => {
            const accent = FORMAT_ACCENTS[topic.format] ?? defaultAccent();
            const formatLabel = FORMAT_LABELS[topic.format] ?? "Post";
            return (
              <li
                key={`${topic.title}-${idx}`}
                className="group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-zinc-900/40 p-5 backdrop-blur-xl transition-all hover:border-white/10 hover:bg-zinc-900/60"
              >
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-white/15 to-transparent"
                />
                <div
                  aria-hidden
                  className="pointer-events-none absolute -right-16 -bottom-16 h-44 w-44 rounded-full bg-gradient-to-br from-violet-500/[0.05] to-fuchsia-500/[0.05] opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100"
                />

                <div className="relative flex items-center justify-between gap-2">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full border bg-gradient-to-r px-2.5 py-0.5 text-[11px] font-medium tracking-wide ${accent}`}
                  >
                    {formatLabel}
                  </span>
                  {topic.category && (
                    <span className="font-mono text-[11px] uppercase tracking-wider text-zinc-500">
                      {topic.category}
                    </span>
                  )}
                </div>

                <h3 className="relative mt-3 text-base font-semibold leading-snug text-white">
                  {topic.title}
                </h3>

                {topic.angle && (
                  <p className="relative mt-2 text-sm text-zinc-400">{topic.angle}</p>
                )}

                {topic.hook && (
                  <div className="relative mt-3 rounded-xl border border-white/[0.06] bg-zinc-950/60 px-3 py-2.5 text-sm italic text-zinc-200">
                    <span className="select-none text-zinc-500">&ldquo;</span>
                    {topic.hook}
                    <span className="select-none text-zinc-500">&rdquo;</span>
                  </div>
                )}

                <div className="relative mt-4 flex items-center gap-2 opacity-80 transition-opacity group-hover:opacity-100">
                  <button
                    type="button"
                    onClick={() => openDraft(topic)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-xs font-medium text-zinc-100 transition-colors hover:bg-white/10"
                  >
                    <PencilIcon />
                    <span>Draft post</span>
                  </button>
                </div>
              </li>
            );
          })}
        </ol>
      </div>

      <DraftDrawer
        topic={activeTopic}
        open={drawerOpen}
        hasLinkedinConnection={hasLinkedinConnection}
        onClose={() => setDrawerOpen(false)}
      />
    </div>
  );
}

function SparkleIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M8 1.5l1.5 3.5 3.5 1.5-3.5 1.5L8 11.5 6.5 8 3 6.5 6.5 5 8 1.5z"
        fill="currentColor"
        opacity="0.95"
      />
      <path
        d="M13 10.5l.7 1.6 1.6.7-1.6.7-.7 1.6-.7-1.6-1.6-.7 1.6-.7.7-1.6z"
        fill="currentColor"
        opacity="0.65"
      />
    </svg>
  );
}

function Spinner() {
  return (
    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity="0.25" strokeWidth="4" />
      <path
        d="M22 12a10 10 0 0 1-10 10"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
      />
    </svg>
  );
}

function PencilIcon() {
  return (
    <svg className="h-3.5 w-3.5" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M2.5 13.5L3 11l7-7 2.5 2.5-7 7-2.5.5z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
