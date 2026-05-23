"use client";

import { useActionState } from "react";

import { signUpAction, type AuthFormState } from "../actions";

export default function SignUpForm({
  next,
  initialError,
}: {
  next: string;
  initialError?: string;
}) {
  const [state, formAction, pending] = useActionState<AuthFormState | undefined, FormData>(
    signUpAction,
    initialError ? { error: initialError } : undefined
  );

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="next" value={next} />

      <div className="space-y-1.5">
        <label htmlFor="name" className="text-sm font-medium text-slate-200">
          Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          autoComplete="name"
          placeholder="Ada Lovelace"
          className="w-full rounded-lg border border-white/10 bg-slate-900/60 px-3.5 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-indigo-400/60 focus:outline-none focus:ring-2 focus:ring-indigo-400/30"
        />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="email" className="text-sm font-medium text-slate-200">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          defaultValue={state?.email}
          placeholder="you@company.com"
          className="w-full rounded-lg border border-white/10 bg-slate-900/60 px-3.5 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-indigo-400/60 focus:outline-none focus:ring-2 focus:ring-indigo-400/30"
        />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="password" className="text-sm font-medium text-slate-200">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          minLength={6}
          placeholder="At least 6 characters"
          className="w-full rounded-lg border border-white/10 bg-slate-900/60 px-3.5 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-indigo-400/60 focus:outline-none focus:ring-2 focus:ring-indigo-400/30"
        />
        <p className="text-xs text-slate-500">Use 6 or more characters.</p>
      </div>

      {state?.error && (
        <div
          role="alert"
          className="rounded-lg border border-red-500/30 bg-red-500/10 px-3.5 py-2.5 text-sm text-red-200"
        >
          {state.error}
        </div>
      )}

      <button
        type="submit"
        disabled={pending}
        className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition-all hover:shadow-blue-500/40 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "Creating your account…" : "Create account"}
      </button>
    </form>
  );
}
