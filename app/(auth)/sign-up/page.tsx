import Link from "next/link";

import OAuthButtons from "../oauth-buttons";
import SignUpForm from "./sign-up-form";

type SignUpPageProps = {
  searchParams: Promise<{ next?: string; error?: string }>;
};

export const metadata = {
  title: "Create your SocialBoost account",
};

export default async function SignUpPage({ searchParams }: SignUpPageProps) {
  const params = await searchParams;
  const next = params.next ?? "/app";

  return (
    <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-8 shadow-[0_8px_40px_-12px_rgba(0,0,0,0.6)] backdrop-blur-xl">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-white">Create your account</h1>
        <p className="mt-1 text-sm text-slate-400">
          Start growing your LinkedIn audience on autopilot.
        </p>
      </div>

      <OAuthButtons next={next} />

      <div className="my-5 flex items-center gap-3 text-xs uppercase tracking-wider text-slate-500">
        <div className="h-px flex-1 bg-white/10" />
        <span>or</span>
        <div className="h-px flex-1 bg-white/10" />
      </div>

      <SignUpForm next={next} initialError={params.error} />

      <p className="mt-6 text-center text-sm text-slate-400">
        Already have an account?{" "}
        <Link
          href={{ pathname: "/sign-in", query: next ? { next } : undefined }}
          className="font-medium text-indigo-300 hover:text-indigo-200"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
