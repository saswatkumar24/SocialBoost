"use client";

import { useEffect, useRef, useState, useTransition } from "react";

import type { TopicSuggestion } from "@/lib/creator-profile-shared";

import { draftPostAction, publishPostAction } from "./actions";

const FORMAT_LABELS: Record<string, string> = {
  story: "Story",
  "tactical-list": "Tactical list",
  "contrarian-take": "Contrarian take",
  "case-study": "Case study",
  framework: "Framework",
  "data-drop": "Data drop",
};

type Props = {
  topic: TopicSuggestion | null;
  open: boolean;
  hasLinkedinConnection: boolean;
  onClose: () => void;
};

type PublishState =
  | { status: "idle" }
  | { status: "publishing" }
  | { status: "success"; postUrn?: string }
  | { status: "error"; message: string; needsReconnect?: boolean; notConnected?: boolean };

export default function DraftDrawer({
  topic,
  open,
  hasLinkedinConnection,
  onClose,
}: Props) {
  const [body, setBody] = useState("");
  const [draftError, setDraftError] = useState<string | null>(null);
  const [publishState, setPublishState] = useState<PublishState>({ status: "idle" });
  const [copied, setCopied] = useState(false);
  const [draftPending, startDraft] = useTransition();
  const [publishPending, startPublish] = useTransition();
  const lastTopicKey = useRef<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // Lock body scroll while open.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // Close on escape.
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // When the user opens the drawer for a new topic, reset state and kick off a draft.
  useEffect(() => {
    if (!open || !topic) return;
    const key = `${topic.title}::${topic.format}`;
    if (lastTopicKey.current === key) return;
    lastTopicKey.current = key;

    setBody("");
    setDraftError(null);
    setPublishState({ status: "idle" });
    setCopied(false);

    startDraft(async () => {
      const result = await draftPostAction(topic);
      if (result.error) {
        setDraftError(result.error);
        return;
      }
      setBody(result.body);
      // Focus the textarea once the draft arrives.
      requestAnimationFrame(() => {
        textareaRef.current?.focus();
        textareaRef.current?.setSelectionRange(0, 0);
      });
    });
  }, [open, topic]);

  // When the drawer closes, allow re-running for the same topic next time.
  useEffect(() => {
    if (!open) {
      lastTopicKey.current = null;
    }
  }, [open]);

  function handleRegenerate() {
    if (!topic) return;
    setDraftError(null);
    setPublishState({ status: "idle" });
    startDraft(async () => {
      const result = await draftPostAction(topic);
      if (result.error) {
        setDraftError(result.error);
        return;
      }
      setBody(result.body);
    });
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(body);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // No-op; clipboard may be blocked.
    }
  }

  function handlePublish() {
    if (!body.trim()) return;
    setPublishState({ status: "publishing" });
    startPublish(async () => {
      const result = await publishPostAction({ body });
      if (result.ok) {
        setPublishState({ status: "success", postUrn: result.postUrn });
      } else {
        setPublishState({
          status: "error",
          message: result.error ?? "Could not publish to LinkedIn.",
          needsReconnect: result.needsReconnect,
          notConnected: result.notConnected,
        });
      }
    });
  }

  const charCount = body.length;
  const charLimit = 3000;
  const overLimit = charCount > charLimit;

  return (
    <div
      className={`fixed inset-0 z-50 ${open ? "" : "pointer-events-none"}`}
      aria-hidden={!open}
    >
      <div
        className={`absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />
      <aside
        className={`absolute inset-y-0 right-0 flex w-full max-w-xl flex-col border-l border-white/[0.06] bg-[#0b0a12] shadow-2xl transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Draft LinkedIn post"
      >
        <header className="flex items-start justify-between gap-3 border-b border-white/[0.06] px-6 py-5">
          <div className="min-w-0">
            <p className="text-[11px] font-mono font-medium uppercase tracking-[0.2em] text-violet-300/80">
              Draft · {topic?.format ? FORMAT_LABELS[topic.format] ?? topic.format : "Post"}
            </p>
            <h2 className="mt-1 line-clamp-2 text-base font-semibold leading-snug text-white">
              {topic?.title ?? "—"}
            </h2>
            {topic?.angle && (
              <p className="mt-1 line-clamp-2 text-xs text-zinc-400">{topic.angle}</p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close draft"
            className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/[0.06] bg-white/[0.04] text-zinc-300 transition-colors hover:bg-white/[0.08]"
          >
            <CloseIcon />
          </button>
        </header>

        <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-6 py-5">
          {draftPending && !body && (
            <div className="flex items-center gap-2 rounded-xl border border-white/[0.06] bg-white/[0.03] px-4 py-3 text-sm text-zinc-300">
              <Spinner />
              <span>Writing your post with GPT-5.4…</span>
            </div>
          )}

          {draftError && (
            <div className="rounded-xl border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
              {draftError}
            </div>
          )}

          <label className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500">
                Post body
              </span>
              <span
                className={`font-mono text-[10px] uppercase tracking-[0.2em] ${
                  overLimit ? "text-rose-300" : "text-zinc-500"
                }`}
              >
                {charCount.toLocaleString()} / {charLimit.toLocaleString()}
              </span>
            </div>
            <textarea
              ref={textareaRef}
              value={body}
              onChange={(e) => {
                setBody(e.target.value);
                if (publishState.status === "success" || publishState.status === "error") {
                  setPublishState({ status: "idle" });
                }
              }}
              disabled={draftPending && !body}
              placeholder="Your draft will appear here in a moment…"
              className="min-h-[260px] flex-1 resize-y rounded-xl border border-white/[0.08] bg-zinc-950/60 px-4 py-3 text-sm leading-relaxed text-zinc-100 outline-none transition-colors placeholder:text-zinc-600 focus:border-violet-400/40 disabled:cursor-not-allowed disabled:opacity-60"
              rows={14}
            />
          </label>

          {publishState.status === "success" && (
            <div className="rounded-xl border border-emerald-400/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100">
              <div className="font-medium">Posted to LinkedIn.</div>
              {publishState.postUrn && (
                <div className="mt-0.5 break-all text-xs text-emerald-200/80">
                  {publishState.postUrn}
                </div>
              )}
            </div>
          )}

          {publishState.status === "error" && (
            <div className="rounded-xl border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
              <div>{publishState.message}</div>
              {(publishState.needsReconnect || publishState.notConnected) && (
                <a
                  href="/api/linkedin/connect"
                  className="mt-2 inline-flex items-center gap-1.5 rounded-lg border border-rose-300/30 bg-rose-500/15 px-2.5 py-1 text-xs font-semibold text-rose-100 transition-colors hover:bg-rose-500/25"
                >
                  {publishState.notConnected ? "Connect LinkedIn" : "Reconnect LinkedIn"}
                </a>
              )}
            </div>
          )}
        </div>

        <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.06] px-6 py-4">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleRegenerate}
              disabled={draftPending || publishPending}
              className="inline-flex items-center gap-1.5 rounded-lg border border-white/[0.08] bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-zinc-200 transition-colors hover:bg-white/[0.08] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {draftPending ? <Spinner /> : <SparkleIcon />}
              <span>Regenerate</span>
            </button>
            <button
              type="button"
              onClick={handleCopy}
              disabled={!body || draftPending}
              className="inline-flex items-center gap-1.5 rounded-lg border border-white/[0.08] bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-zinc-200 transition-colors hover:bg-white/[0.08] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <CopyIcon />
              <span>{copied ? "Copied" : "Copy"}</span>
            </button>
          </div>

          {hasLinkedinConnection ? (
            <button
              type="button"
              onClick={handlePublish}
              disabled={
                publishPending || !body.trim() || overLimit || draftPending
              }
              className="group relative inline-flex items-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-violet-500 via-fuchsia-500 to-cyan-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-violet-500/30 transition-all hover:shadow-fuchsia-500/40 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <span className="relative z-10 inline-flex items-center gap-2">
                {publishPending ? <Spinner /> : <LinkedInIcon />}
                <span>Publish to LinkedIn</span>
              </span>
              <span
                aria-hidden
                className="absolute inset-0 -z-0 bg-gradient-to-r from-fuchsia-500 via-violet-500 to-violet-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              />
            </button>
          ) : (
            <a
              href="/api/linkedin/connect"
              className="inline-flex items-center gap-2 rounded-xl border border-violet-400/30 bg-violet-500/15 px-4 py-2 text-sm font-semibold text-violet-100 transition-colors hover:bg-violet-500/25"
            >
              <LinkedInIcon />
              <span>Connect LinkedIn to publish</span>
            </a>
          )}
        </footer>
      </aside>
    </div>
  );
}

function CloseIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M6 6l12 12M6 18L18 6"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CopyIcon() {
  return (
    <svg className="h-3.5 w-3.5" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <rect
        x="4.5"
        y="4.5"
        width="8"
        height="9"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="1.4"
      />
      <path
        d="M2.5 11V3a1.5 1.5 0 0 1 1.5-1.5H10"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

function SparkleIcon() {
  return (
    <svg className="h-3.5 w-3.5" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="M8 1.5l1.5 3.5 3.5 1.5-3.5 1.5L8 11.5 6.5 8 3 6.5 6.5 5 8 1.5z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9.5h4v11H3v-11zM10 9.5h3.84v1.5h.05c.54-1 1.85-2.06 3.81-2.06 4.07 0 4.82 2.68 4.82 6.16V20.5h-4v-4.7c0-1.12-.02-2.56-1.56-2.56-1.57 0-1.81 1.22-1.81 2.48V20.5h-4v-11z" />
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
