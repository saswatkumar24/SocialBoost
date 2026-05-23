"use client";

import { useActionState, useState } from "react";

import {
  CONTENT_CATEGORIES,
  MAX_CATEGORIES,
  TONE_OPTIONS,
  type CreatorProfile,
} from "@/lib/creator-profile-shared";

import {
  savePreferencesAction,
  type PreferencesFormState,
} from "./actions";

type PreferencesFormProps = {
  initial: CreatorProfile | null;
};

export default function PreferencesForm({ initial }: PreferencesFormProps) {
  const [state, formAction, pending] = useActionState<
    PreferencesFormState | undefined,
    FormData
  >(savePreferencesAction, undefined);

  const [description, setDescription] = useState(initial?.description ?? "");
  const [categories, setCategories] = useState<string[]>(initial?.categories ?? []);
  const [audience, setAudience] = useState(initial?.target_audience ?? "");
  const [tone, setTone] = useState(initial?.tone ?? "");

  function toggleCategory(label: string) {
    setCategories((prev) => {
      if (prev.includes(label)) {
        return prev.filter((c) => c !== label);
      }
      if (prev.length >= MAX_CATEGORIES) return prev;
      return [...prev, label];
    });
  }

  return (
    <form action={formAction} className="space-y-6">
      {categories.map((c) => (
        <input key={c} type="hidden" name="categories" value={c} />
      ))}

      <Card>
        <CardHeader
          eyebrow="01"
          title="What do you write about?"
          description="Describe your area of expertise and the kind of posts you want to publish. SocialBoost uses this to draft topics that sound like you."
        />

        <label htmlFor="description" className="text-sm font-medium text-zinc-200">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={5}
          maxLength={1000}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="e.g. I'm a staff engineer writing about scaling distributed systems, on-call culture, and the human side of building reliable software."
          className="mt-2 block w-full resize-y rounded-xl border border-white/10 bg-zinc-950/70 px-3.5 py-2.5 text-sm text-white placeholder:text-zinc-500 focus:border-violet-400/60 focus:outline-none focus:ring-2 focus:ring-violet-400/20"
        />
        <p className="mt-2 text-xs text-zinc-500">
          {description.length} / 1000 characters
        </p>
      </Card>

      <Card>
        <CardHeader
          eyebrow="02"
          title="Categories"
          description={`Pick up to ${MAX_CATEGORIES} that match the topics you want to be known for.`}
          right={
            <span className="text-xs font-medium text-zinc-400">
              {categories.length} / {MAX_CATEGORIES}
            </span>
          }
        />

        <div className="flex flex-wrap gap-2">
          {CONTENT_CATEGORIES.map((label) => {
            const selected = categories.includes(label);
            const disabled = !selected && categories.length >= MAX_CATEGORIES;
            return (
              <button
                key={label}
                type="button"
                disabled={disabled}
                aria-pressed={selected}
                onClick={() => toggleCategory(label)}
                className={`group relative inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-all ${
                  selected
                    ? "border-violet-400/60 bg-gradient-to-r from-violet-500/20 to-fuchsia-500/15 text-white shadow-sm shadow-violet-500/20"
                    : "border-white/10 bg-white/5 text-zinc-300 hover:border-white/20 hover:bg-white/10 hover:text-white"
                } ${disabled ? "cursor-not-allowed opacity-40" : "cursor-pointer"}`}
              >
                {selected && (
                  <svg
                    className="h-3.5 w-3.5 text-fuchsia-300"
                    viewBox="0 0 16 16"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M3.5 8.5l3 3 6-7"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
                <span>{label}</span>
              </button>
            );
          })}
        </div>
      </Card>

      <Card>
        <CardHeader
          eyebrow="03"
          title="Audience & voice"
          description="Optional — but the more we know, the sharper the drafts."
        />

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label htmlFor="target_audience" className="text-sm font-medium text-zinc-200">
              Target audience
            </label>
            <input
              id="target_audience"
              name="target_audience"
              type="text"
              maxLength={200}
              value={audience}
              onChange={(e) => setAudience(e.target.value)}
              placeholder="e.g. Senior engineers and engineering managers"
              className="mt-2 block w-full rounded-xl border border-white/10 bg-zinc-950/70 px-3.5 py-2.5 text-sm text-white placeholder:text-zinc-500 focus:border-violet-400/60 focus:outline-none focus:ring-2 focus:ring-violet-400/20"
            />
            <p className="mt-2 text-xs text-zinc-500">
              Who do you want to reach? The more specific, the better.
            </p>
          </div>

          <div>
            <label htmlFor="tone" className="text-sm font-medium text-zinc-200">
              Voice & tone
            </label>
            <select
              id="tone"
              name="tone"
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              className="mt-2 block w-full rounded-xl border border-white/10 bg-zinc-950/70 px-3.5 py-2.5 text-sm text-white focus:border-violet-400/60 focus:outline-none focus:ring-2 focus:ring-violet-400/20"
            >
              <option value="">No preference</option>
              {TONE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <p className="mt-2 text-xs text-zinc-500">
              Sets the default vibe for drafted posts.
            </p>
          </div>
        </div>
      </Card>

      {state?.status === "saved" && (
        <div
          role="status"
          className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-2.5 text-sm text-emerald-200"
        >
          Saved. Your preferences will steer every draft from now on.
        </div>
      )}

      {state?.status === "error" && state.message && (
        <div
          role="alert"
          className="rounded-xl border border-red-500/30 bg-red-500/10 px-3.5 py-2.5 text-sm text-red-200"
        >
          {state.message}
        </div>
      )}

      <div className="flex items-center justify-end gap-3">
        <button
          type="submit"
          disabled={pending}
          className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-violet-500 via-fuchsia-500 to-cyan-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-500/30 transition-all hover:shadow-fuchsia-500/40 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <span className="relative z-10">
            {pending ? "Saving…" : "Save preferences"}
          </span>
          <span
            aria-hidden
            className="absolute inset-0 -z-0 bg-gradient-to-r from-fuchsia-500 via-violet-500 to-violet-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          />
        </button>
      </div>
    </form>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <section className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-zinc-900/40 p-6 backdrop-blur-xl">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-white/15 to-transparent"
      />
      {children}
    </section>
  );
}

function CardHeader({
  eyebrow,
  title,
  description,
  right,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  right?: React.ReactNode;
}) {
  return (
    <div className="mb-5 flex items-start justify-between gap-3">
      <div>
        {eyebrow && (
          <div className="text-[11px] font-mono font-medium uppercase tracking-[0.2em] text-zinc-500">
            {eyebrow}
          </div>
        )}
        <h2 className="mt-0.5 text-lg font-semibold text-white">{title}</h2>
        {description && (
          <p className="mt-1 max-w-xl text-sm text-zinc-400">{description}</p>
        )}
      </div>
      {right}
    </div>
  );
}
