import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/auth";
import { getLinkedinConnection } from "@/lib/linkedin-connection";

import ConnectionsPanel from "./connections-panel";

export const metadata = {
  title: "Connections — SocialBoost",
};

type Search = Promise<Record<string, string | string[] | undefined>>;

export default async function ConnectionsPage({
  searchParams,
}: {
  searchParams: Search;
}) {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/sign-in?next=/app/settings/connections");
  }

  const connection = await getLinkedinConnection(user.id);
  const params = await searchParams;
  const status = typeof params.status === "string" ? params.status : null;
  const message = typeof params.message === "string" ? params.message : null;

  let banner: { kind: "ok" | "error"; message: string } | null = null;
  if (status === "connected") {
    banner = { kind: "ok", message: "LinkedIn connected." };
  } else if (status === "error" && message) {
    banner = { kind: "error", message };
  } else if (status === "error") {
    banner = { kind: "error", message: "Could not connect LinkedIn. Please try again." };
  }

  return (
    <div className="space-y-8">
      <header>
        <p className="text-[11px] font-mono font-medium uppercase tracking-[0.2em] text-violet-300/80">
          Settings · Connections
        </p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight text-white sm:text-[2.5rem]">
          Link the accounts SocialBoost posts to.
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-zinc-400">
          Connect a LinkedIn account so SocialBoost can publish drafts on your behalf. We
          only request the scopes needed to read your basic profile and post on your
          feed.
        </p>
      </header>

      <ConnectionsPanel
        connection={
          connection
            ? {
                linkedin_name: connection.linkedin_name,
                linkedin_email: connection.linkedin_email,
                linkedin_picture: connection.linkedin_picture,
                connected_at: connection.connected_at,
                scope: connection.scope,
              }
            : null
        }
        banner={banner}
      />
    </div>
  );
}
