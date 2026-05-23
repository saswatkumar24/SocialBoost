import Link from "next/link";

import OAuthButtons from "../oauth-buttons";
import SignInForm from "./sign-in-form";

type SignInPageProps = {
  searchParams: Promise<{ next?: string; error?: string }>;
};

export const metadata = {
  title: "Sign in — SocialBoost",
};

export default async function SignInPage({ searchParams }: SignInPageProps) {
  const params = await searchParams;
  const next = params.next ?? "/app";

  return (
    <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-8 shadow-[0_8px_40px_-12px_rgba(0,0,0,0.6)] backdrop-blur-xl">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-white">Welcome back</h1>
        <p className="mt-1 text-sm text-slate-400">
          Sign in to keep your LinkedIn engine running.
        </p>
      </div>

      <OAuthButtons next={next} />

      <div className="my-5 flex items-center gap-3 text-xs uppercase tracking-wider text-slate-500">
        <div className="h-px flex-1 bg-white/10" />
        <span>or</span>
        <div className="h-px flex-1 bg-white/10" />
      </div>

      <SignInForm next={next} initialError={params.error} />

      <p className="mt-6 text-center text-sm text-slate-400">
        New to SocialBoost?{" "}
        <Link
          href={{ pathname: "/sign-up", query: next ? { next } : undefined }}
          className="font-medium text-indigo-300 hover:text-indigo-200"
        >
          Create an account
        </Link>
      </p>
    </div>
  );
}
