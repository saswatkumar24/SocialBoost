"use client";

import { useActionState } from "react";

import { disconnectLinkedinAction, type DisconnectLinkedinState } from "./actions";

type Connection = {
  linkedin_name: string | null;
  linkedin_email: string | null;
  linkedin_picture: string | null;
  connected_at: string;
  scope: string | null;
};

type Props = {
  connection: Connection | null;
  banner: { kind: "ok" | "error"; message: string } | null;
};

const initialState: DisconnectLinkedinState = { status: "idle" };

export default function ConnectionsPanel({ connection, banner }: Props) {
  const [state, formAction, pending] = useActionState(
    disconnectLinkedinAction,
    initialState
  );

  return (
    <div className="space-y-4">
      {banner && (
        <div
          className={`rounded-xl border px-4 py-3 text-sm ${
            banner.kind === "ok"
              ? "border-emerald-400/30 bg-emerald-500/10 text-emerald-100"
              : "border-rose-400/30 bg-rose-500/10 text-rose-100"
          }`}
        >
          {banner.message}
        </div>
      )}

      {state.status === "ok" && state.message && (
        <div className="rounded-xl border border-emerald-400/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100">
          {state.message}
        </div>
      )}
      {state.status === "error" && state.message && (
        <div className="rounded-xl border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
          {state.message}
        </div>
      )}

      <section className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-zinc-900/40 p-6 backdrop-blur-xl">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"
        />

        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#0a66c2] text-white">
              <LinkedInGlyph />
            </div>
            <div className="min-w-0">
              <h2 className="text-lg font-semibold text-white">LinkedIn</h2>
              <p className="mt-0.5 text-sm text-zinc-400">
                SocialBoost uses your LinkedIn connection to publish drafts on your behalf via
                the official Posts API.
              </p>
            </div>
          </div>

          {connection && !pending && state.status !== "ok" ? (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-200">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
              Connected
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-xs font-medium text-zinc-300">
              Not connected
            </span>
          )}
        </div>

        {connection && state.status !== "ok" ? (
          <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              {connection.linkedin_picture ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={connection.linkedin_picture}
                  alt={connection.linkedin_name ?? "LinkedIn user"}
                  className="h-10 w-10 rounded-full object-cover ring-1 ring-white/10"
                />
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-violet-500/30 via-fuchsia-500/25 to-cyan-500/25 text-sm font-semibold text-white ring-1 ring-white/10">
                  {(connection.linkedin_name ?? connection.linkedin_email ?? "?")
                    .charAt(0)
                    .toUpperCase()}
                </div>
              )}
              <div className="min-w-0">
                <div className="truncate text-sm font-medium text-white">
                  {connection.linkedin_name ?? "LinkedIn account"}
                </div>
                {connection.linkedin_email && (
                  <div className="truncate text-xs text-zinc-400">
                    {connection.linkedin_email}
                  </div>
                )}
                <div className="mt-0.5 text-[11px] text-zinc-500">
                  Connected{" "}
                  {new Date(connection.connected_at).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </div>
              </div>
            </div>

            <form action={formAction} className="flex items-center gap-2">
              <a
                href="/api/linkedin/connect"
                className="inline-flex items-center gap-1.5 rounded-lg border border-white/[0.08] bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-zinc-200 transition-colors hover:bg-white/[0.08]"
              >
                Reconnect
              </a>
              <button
                type="submit"
                disabled={pending}
                className="inline-flex items-center gap-1.5 rounded-lg border border-rose-400/30 bg-rose-500/10 px-3 py-1.5 text-xs font-medium text-rose-100 transition-colors hover:bg-rose-500/20 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {pending ? "Disconnecting…" : "Disconnect"}
              </button>
            </form>
          </div>
        ) : (
          <div className="mt-5">
            <a
              href="/api/linkedin/connect"
              className="group relative inline-flex items-center gap-2 overflow-hidden rounded-xl bg-[#0a66c2] px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[#0a66c2]/30 transition-all hover:bg-[#0858a8]"
            >
              <LinkedInGlyph />
              <span>Connect LinkedIn</span>
            </a>
            <p className="mt-3 text-xs text-zinc-500">
              We&apos;ll request the <span className="text-zinc-300">openid profile email</span>{" "}
              scopes to identify you and <span className="text-zinc-300">w_member_social</span> to
              publish posts on your behalf. You can disconnect any time.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}

function LinkedInGlyph() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9.5h4v11H3v-11zM10 9.5h3.84v1.5h.05c.54-1 1.85-2.06 3.81-2.06 4.07 0 4.82 2.68 4.82 6.16V20.5h-4v-4.7c0-1.12-.02-2.56-1.56-2.56-1.57 0-1.81 1.22-1.81 2.48V20.5h-4v-11z" />
    </svg>
  );
}
