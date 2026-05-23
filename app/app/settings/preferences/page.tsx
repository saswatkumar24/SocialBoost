import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/auth";
import { getCreatorProfile } from "@/lib/creator-profile";

import PreferencesForm from "./preferences-form";

export const metadata = {
  title: "Preferences — SocialBoost",
};

export default async function PreferencesPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/sign-in?next=/app/settings/preferences");
  }

  const profile = await getCreatorProfile(user.id);

  return (
    <div className="space-y-8">
      <header>
        <p className="text-[11px] font-mono font-medium uppercase tracking-[0.2em] text-violet-300/80">
          Settings · Preferences
        </p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight text-white sm:text-[2.5rem]">
          Tell SocialBoost what you want to be known for.
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-zinc-400">
          The more we know about your expertise, audience, and voice, the better the
          topics and drafts we generate for you. Update this anytime.
        </p>
      </header>

      <PreferencesForm initial={profile} />
    </div>
  );
}
