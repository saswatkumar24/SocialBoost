"use client";

import { useState } from "react";
import { draftPostAction, publishPostAction } from "../content/actions";

type DirectPostFormProps = {
  linkedinConnected: boolean;
};

export default function DirectPostForm({ linkedinConnected }: DirectPostFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [postBody, setPostBody] = useState("");
  const [isDrafting, setIsDrafting] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishedUrn, setPublishedUrn] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showWarning, setShowWarning] = useState(false);

  const handleOpen = () => {
    if (!linkedinConnected) {
      setShowWarning(true);
      setTimeout(() => setShowWarning(false), 4000);
      return;
    }
    setIsOpen(true);
    setPublishedUrn(null);
    setPostBody("");
    setPrompt("");
    setError(null);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleAiSuggest = async () => {
    if (!prompt.trim()) {
      setError("Please describe what you want to write about first.");
      return;
    }
    setIsDrafting(true);
    setError(null);
    try {
      const res = await draftPostAction({
        title: prompt.trim(),
        angle: "",
        hook: "",
        format: "story",
      });
      if (res.error) {
        setError(res.error);
      } else {
        setPostBody(res.body);
      }
    } catch (err) {
      setError("Failed to generate draft. Please try again.");
    } finally {
      setIsDrafting(false);
    }
  };

  const handlePublish = async () => {
    if (!postBody.trim()) {
      setError("Post content cannot be empty.");
      return;
    }
    setIsPublishing(true);
    setError(null);
    try {
      const res = await publishPostAction({ body: postBody.trim() });
      if (!res.ok) {
        setError(res.error ?? "Failed to publish post.");
      } else if (res.postUrn) {
        setPublishedUrn(res.postUrn);
      }
    } catch (err) {
      setError("Failed to publish post. Please try again.");
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <>
      {/* Trigger Card/Button on Dashboard */}
      <div className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-zinc-900/40 p-6 backdrop-blur-xl transition-all hover:border-white/[0.1]">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"
        />
        <div className="flex flex-col justify-between h-full gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-cyan-400/30 bg-cyan-500/10 px-2.5 py-1 text-[11px] font-medium text-cyan-200">
              <span className="relative flex h-1.5 w-1.5">
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-cyan-300" />
              </span>
              Instant publishing
            </div>
            <h2 className="mt-3 text-lg font-semibold text-white">Post directly to LinkedIn</h2>
            <p className="mt-1.5 text-sm text-zinc-400">
              Draft your post, use AI suggestions to polish the text, and publish instantly on your LinkedIn profile.
            </p>
          </div>
          <button
            onClick={handleOpen}
            className="group relative inline-flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl border border-white/10 bg-white/5 py-2.5 text-sm font-semibold text-zinc-200 transition-all hover:bg-white/10 hover:text-white"
          >
            <span>Create direct post</span>
            <ArrowIcon />
          </button>
        </div>

        {/* Compulsory connection warning toast/alert */}
        {showWarning && (
          <div className="absolute inset-x-4 bottom-4 flex items-center gap-2 rounded-xl border border-rose-500/20 bg-rose-500/10 p-3 text-xs font-medium text-rose-200 backdrop-blur-md transition-all duration-300">
            <svg className="h-4 w-4 shrink-0 text-rose-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <span>Please connect to your LinkedIn profile first to enable posting.</span>
          </div>
        )}
      </div>

      {/* Modal Popup */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div onClick={handleClose} className="fixed inset-0 bg-black/80 backdrop-blur-md" />

          {/* Modal Content */}
          <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-white/[0.08] bg-zinc-900 p-6 shadow-2xl backdrop-blur-xl transition-all">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"
            />
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-4">
              <h3 className="text-lg font-semibold text-white">Create a direct post</h3>
              <button
                onClick={handleClose}
                className="rounded-lg p-1 text-zinc-400 hover:bg-white/5 hover:text-white"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Success state */}
            {publishedUrn ? (
              <div className="my-8 flex flex-col items-center text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
                  <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h4 className="mt-4 text-xl font-bold text-white">Post Published Successfully!</h4>
                <p className="mt-2 text-sm text-zinc-400">
                  Your post has been successfully published to your LinkedIn feed.
                </p>
                <a
                  href={`https://www.linkedin.com/feed/update/${publishedUrn}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-500 via-fuchsia-500 to-cyan-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-500/25 transition-all hover:opacity-95"
                >
                  <span>View post on LinkedIn</span>
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
                <button
                  onClick={handleClose}
                  className="mt-4 text-xs text-zinc-500 hover:text-zinc-300 underline"
                >
                  Go back to Dashboard
                </button>
              </div>
            ) : (
              /* Writing state */
              <div className="mt-5 space-y-4">
                {error && (
                  <div className="flex items-start gap-2 rounded-xl border border-rose-500/20 bg-rose-500/10 p-3.5 text-sm text-rose-200">
                    <svg className="h-5 w-5 shrink-0 text-rose-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <span>{error}</span>
                  </div>
                )}

                {/* AI Prompt Input */}
                <div className="space-y-1.5">
                  <label className="text-xs font-mono uppercase tracking-[0.1em] text-zinc-400">
                    AI Suggestion Prompt
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. Write a contrarian take about microservices vs monoliths..."
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      disabled={isDrafting || isPublishing}
                      className="flex-1 rounded-xl border border-white/[0.08] bg-zinc-950 px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:border-violet-500 focus:outline-none disabled:opacity-50"
                    />
                    <button
                      type="button"
                      onClick={handleAiSuggest}
                      disabled={isDrafting || isPublishing}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-semibold text-zinc-200 hover:bg-white/10 hover:text-white disabled:opacity-50"
                    >
                      {isDrafting ? (
                        <>
                          <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          <span>Drafting...</span>
                        </>
                      ) : (
                        <>
                          <SparkleIcon />
                          <span>AI Suggest</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Post Content */}
                <div className="space-y-1.5">
                  <label className="text-xs font-mono uppercase tracking-[0.1em] text-zinc-400">
                    Post Body
                  </label>
                  <textarea
                    rows={8}
                    placeholder="Write your LinkedIn post here..."
                    value={postBody}
                    onChange={(e) => setPostBody(e.target.value)}
                    disabled={isPublishing}
                    className="w-full rounded-xl border border-white/[0.08] bg-zinc-950 p-4 text-sm text-white placeholder-zinc-600 focus:border-violet-500 focus:outline-none disabled:opacity-50"
                  />
                  <div className="flex justify-end text-xs text-zinc-500">
                    {postBody.length}/3000 chars
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3 border-t border-white/[0.06] pt-4">
                  <button
                    type="button"
                    onClick={handleClose}
                    disabled={isPublishing}
                    className="rounded-xl border border-white/5 bg-zinc-800 px-4 py-2.5 text-sm font-semibold text-zinc-300 hover:bg-zinc-700 hover:text-white disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handlePublish}
                    disabled={isPublishing || !postBody.trim()}
                    className="group relative inline-flex items-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-violet-500 via-fuchsia-500 to-cyan-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-500/25 transition-all hover:shadow-violet-500/35 disabled:opacity-50"
                  >
                    {isPublishing ? (
                      <>
                        <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        <span>Publishing...</span>
                      </>
                    ) : (
                      <>
                        <span>Publish Now</span>
                        <ArrowIcon />
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

function ArrowIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none">
      <path
        d="M3 8h10m0 0L9 4m4 4l-4 4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SparkleIcon() {
  return (
    <svg className="h-4 w-4 text-cyan-300" viewBox="0 0 16 16" fill="currentColor">
      <path d="M8 1.5l1.5 3.5 3.5 1.5-3.5 1.5L8 11.5 6.5 8 3 6.5 6.5 5 8 1.5z" />
    </svg>
  );
}
