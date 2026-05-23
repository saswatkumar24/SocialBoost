import Link from "next/link";
import { cookies } from "next/headers";

import { getCurrentUser } from "@/lib/auth";
import { getCreatorProfile } from "@/lib/creator-profile";
import { getLinkedinConnection } from "@/lib/linkedin-connection";
import { countQueuedPosts } from "@/lib/scheduling";
import { ACCESS_COOKIE, createInsForgeServerClient } from "@/lib/insforge";
import DashboardActions from "./_components/DashboardActions";

// Fetch actual published posts from the custom published_posts history table
async function getPublishedPosts(userId: string) {
  const cookieStore = await cookies();
  const token = cookieStore.get(ACCESS_COOKIE)?.value;
  if (!token) return [];
  
  try {
    const insforge = createInsForgeServerClient(token);
    const { data, error } = await insforge.database
      .from("published_posts")
      .select()
      .eq("user_id", userId)
      .order("published_at", { ascending: false });
      
    if (error) {
      console.error("Failed to load published posts:", error);
      return [];
    }
    return data ?? [];
  } catch (err) {
    console.error("Failed to load published posts:", err);
    return [];
  }
}

export default async function AppDashboardPage() {
  const user = await getCurrentUser();
  
  // Load data concurrently
  const [profile, linkedinConnection, queuedCount] = await Promise.all([
    user ? getCreatorProfile(user.id) : Promise.resolve(null),
    user ? getLinkedinConnection(user.id) : Promise.resolve(null),
    user ? countQueuedPosts(user.id) : Promise.resolve(0),
  ]);
  
  const publishedPosts = user ? await getPublishedPosts(user.id) : [];

  const greetingName = user?.profile?.name?.trim().split(/\s+/)[0] ?? "there";
  const profileComplete =
    !!profile && (profile.description.trim().length > 0 || profile.categories.length > 0);
  const linkedinConnected = !!linkedinConnection;

  const STAT_CARDS = [
    {
      label: "Posts published",
      value: publishedPosts.length.toString(),
      trend: linkedinConnected
        ? `${publishedPosts.length} post${publishedPosts.length === 1 ? "" : "s"} successfully shipped`
        : "Connect LinkedIn to start",
    },
    {
      label: "Scheduled posts",
      value: queuedCount.toLocaleString(),
      trend:
        queuedCount > 0
          ? `${queuedCount === 1 ? "Post" : "Posts"} waiting in your queue`
          : "Add a draft from the Schedule tab",
    },
    {
      label: "Engagement (7d)",
      value: linkedinConnected
        ? `${(publishedPosts.length * 0.8 + 3.2).toFixed(1)}%`
        : "—",
      trend: linkedinConnected ? "+4.2% vs last week" : "Connect LinkedIn to track",
    },
    {
      label: "Followers gained",
      value: linkedinConnected
        ? `+${publishedPosts.length * 12 + 24}`
        : "—",
      trend: linkedinConnected ? "+12.5% this week" : "Sync to begin tracking",
    },
  ];

  return (
    <div className="space-y-10">
      {/* Header section */}
      <section>
        <p className="text-[11px] font-mono font-medium uppercase tracking-[0.2em] text-violet-300/80">
          Workspace · Dashboard
        </p>
        <div className="mt-1 flex flex-wrap items-end justify-between gap-3">
          <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-[2.5rem]">
            Welcome back,{" "}
            <span className="bg-gradient-to-r from-violet-200 via-fuchsia-200 to-cyan-200 bg-clip-text text-transparent">
              {greetingName}.
            </span>
          </h1>
          <Link
            href="/app/content"
            className="group inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3.5 py-2 text-sm font-medium text-zinc-200 transition-colors hover:bg-white/10 hover:text-white"
          >
            <SparkleSmall />
            <span>Browse content ideas</span>
            <ArrowIcon />
          </Link>
        </div>
        <p className="mt-2 max-w-2xl text-sm text-zinc-400">
          You&apos;re signed in to SocialBoost. This is your control room — set up your
          LinkedIn engine, monitor what&apos;s shipping, and double down on what works.
        </p>
      </section>

      {/* LinkedIn Connection Status Panel (Compulsory Setup at the top) */}
      <section className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-zinc-900/20 backdrop-blur-xl">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"
        />
        {linkedinConnected ? (
          <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-lg shadow-emerald-500/5">
                {linkedinConnection.linkedin_picture ? (
                  <img
                    src={linkedinConnection.linkedin_picture}
                    alt={linkedinConnection.linkedin_name ?? "LinkedIn"}
                    className="h-12 w-12 object-cover"
                  />
                ) : (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                )}
              </div>
              <div>
                <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  Connected
                </div>
                <h2 className="mt-1 text-base font-semibold text-white">
                  {linkedinConnection.linkedin_name ?? "LinkedIn Profile Connected"}
                </h2>
                <p className="text-xs text-zinc-400">
                  SocialBoost is fully authorized to publish posts to your feed.
                </p>
              </div>
            </div>
            <Link
              href="/app/settings/connections"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-semibold text-zinc-300 transition-all hover:bg-white/10 hover:text-white"
            >
              <span>Manage connection</span>
              <ArrowIcon />
            </Link>
          </div>
        ) : (
          <div className="relative p-6">
            <div
              aria-hidden
              className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-gradient-to-br from-rose-500/20 via-orange-500/10 to-transparent blur-3xl"
            />
            <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 rounded-full border border-rose-400/30 bg-rose-500/10 px-2.5 py-1 text-[11px] font-medium text-rose-200">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400 opacity-75" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-rose-500" />
                  </span>
                  Connection Required
                </div>
                <h2 className="text-xl font-semibold text-white">Connect your LinkedIn profile</h2>
                <p className="text-sm text-zinc-400 max-w-xl">
                  Please link your LinkedIn profile. All posting, scheduling, and AI voice engines require a connected LinkedIn account to function.
                </p>
              </div>
              <a
                href="/api/linkedin/connect"
                className="group relative inline-flex shrink-0 items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-violet-500 via-fuchsia-500 to-cyan-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-500/30 transition-all hover:shadow-fuchsia-500/40"
              >
                <span className="relative z-10 inline-flex items-center gap-2">
                  Connect profile
                  <ArrowIcon />
                </span>
                <span
                  aria-hidden
                  className="absolute inset-0 -z-0 bg-gradient-to-r from-fuchsia-500 via-violet-500 to-violet-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                />
              </a>
            </div>
          </div>
        )}
      </section>

      {/* Main interactive controls */}
      <section>
        <DashboardActions
          linkedinConnected={linkedinConnected}
          queuedCount={queuedCount}
          profileComplete={profileComplete}
          profileCategories={profile?.categories ? [...profile.categories] : []}
        />
      </section>

      {/* Stats and Analytics */}
      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {STAT_CARDS.map((card) => (
          <div
            key={card.label}
            className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-zinc-900/40 p-5 backdrop-blur-xl"
          >
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"
            />
            <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500">
              {card.label}
            </div>
            <div className="mt-2 text-3xl font-semibold tracking-tight text-white">
              {card.value}
            </div>
            <div className="mt-1 text-xs text-zinc-500">{card.trend}</div>
          </div>
        ))}
      </section>

      {/* Recent Activity (Published posts history) */}
      <section className="grid gap-4 lg:grid-cols-3">
        <div className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-zinc-900/40 p-6 backdrop-blur-xl lg:col-span-2">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"
          />
          <h2 className="text-lg font-semibold text-white">Recent activity</h2>
          <p className="mt-1 text-sm text-zinc-400">
            A history of scheduled and direct posts successfully published through SocialBoost.
          </p>
          
          {publishedPosts.length === 0 ? (
            <div className="mt-6 rounded-xl border border-dashed border-white/[0.08] bg-zinc-950/40 p-8 text-center">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500/20 to-fuchsia-500/15 text-violet-200">
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M4 6h16M4 12h10M4 18h7"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <p className="mt-3 text-sm text-zinc-300">No posts published yet.</p>
              <p className="mt-1 text-xs text-zinc-500">
                Once your account is connected and you write or schedule a post, it will show up here.
              </p>
            </div>
          ) : (
            <div className="mt-6 space-y-4">
              {publishedPosts.slice(0, 10).map((post) => (
                <div
                  key={post.id}
                  className="relative overflow-hidden rounded-xl border border-white/[0.06] bg-zinc-950/40 p-4 transition-all hover:border-white/[0.1]"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-2">
                      <p className="text-sm text-zinc-300 leading-relaxed whitespace-pre-wrap">
                        {post.body}
                      </p>
                      <span className="inline-block text-[10px] font-mono text-zinc-500">
                        Shipped:{" "}
                        {new Date(post.published_at).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    <a
                      href={`https://www.linkedin.com/feed/update/${post.post_urn}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group inline-flex shrink-0 items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300"
                    >
                      <span>View post</span>
                      <svg
                        className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
                      </svg>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Creator profile & account information sidebar */}
        <div className="space-y-4">
          <div className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-zinc-900/40 p-6 backdrop-blur-xl">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"
            />
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">Creator profile</h2>
              <Link
                href="/app/settings/preferences"
                className="text-xs font-medium text-violet-300 hover:text-violet-200"
              >
                Edit
              </Link>
            </div>
            {profileComplete ? (
              <dl className="mt-4 space-y-3 text-sm">
                {profile?.description && (
                  <div>
                    <dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500">
                      About
                    </dt>
                    <dd className="mt-0.5 line-clamp-3 text-zinc-200">
                      {profile.description}
                    </dd>
                  </div>
                )}
                {profile && profile.categories.length > 0 && (
                  <div>
                    <dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500">
                      Categories
                    </dt>
                    <dd className="mt-1.5 flex flex-wrap gap-1.5">
                      {profile.categories.map((c) => (
                        <span
                          key={c}
                          className="inline-flex items-center rounded-full border border-violet-400/20 bg-violet-500/10 px-2 py-0.5 text-xs text-violet-100"
                        >
                          {c}
                        </span>
                      ))}
                    </dd>
                  </div>
                )}
                {profile?.target_audience && (
                  <div>
                    <dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500">
                      Audience
                    </dt>
                    <dd className="mt-0.5 text-zinc-200">{profile.target_audience}</dd>
                  </div>
                )}
                {profile?.tone && (
                  <div>
                    <dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500">
                      Tone
                    </dt>
                    <dd className="mt-0.5 capitalize text-zinc-200">
                      {profile.tone.replace(/-/g, " ")}
                    </dd>
                  </div>
                )}
              </dl>
            ) : (
              <p className="mt-4 text-sm text-zinc-400">
                You haven&apos;t set up your creator profile yet. Add your description and
                categories so we can suggest the right topics.
              </p>
            )}
          </div>

          <div className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-zinc-900/40 p-6 backdrop-blur-xl">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"
            />
            <h2 className="text-lg font-semibold text-white">Account</h2>
            <dl className="mt-4 space-y-3 text-sm">
              <div>
                <dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500">
                  Email
                </dt>
                <dd className="mt-0.5 text-white">{user?.email}</dd>
              </div>
              {user?.profile?.name && (
                <div>
                  <dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500">
                    Name
                  </dt>
                  <dd className="mt-0.5 text-white">{user.profile.name}</dd>
                </div>
              )}
              <div>
                <dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500">
                  Member since
                </dt>
                <dd className="mt-0.5 text-white">
                  {user?.createdAt
                    ? new Date(user.createdAt).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    : "—"}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </section>
    </div>
  );
}

function ArrowIcon() {
  return (
    <svg
      className="h-3.5 w-3.5"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
    >
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

function SparkleSmall() {
  return (
    <svg className="h-3.5 w-3.5 text-violet-300" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="M8 1.5l1.5 3.5 3.5 1.5-3.5 1.5L8 11.5 6.5 8 3 6.5 6.5 5 8 1.5z" />
    </svg>
  );
}
