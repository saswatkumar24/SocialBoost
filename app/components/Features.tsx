import SectionHeader from "./SectionHeader";

const FEATURES = [
  {
    title: "Voice cloning that actually sounds like you",
    description:
      "Drop in 3 of your past posts. Our model learns your phrasing, cadence, and worldview — then writes new posts that pass the 'is this really me?' test.",
    badge: "Voice AI",
    accent: "from-blue-500/30 to-cyan-400/20",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden="true">
        <path
          d="M12 2v4M12 18v4M4 12H2M22 12h-2M5 5l1.5 1.5M17.5 17.5L19 19M5 19l1.5-1.5M17.5 6.5L19 5"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.6" />
      </svg>
    ),
  },
  {
    title: "An always-full content calendar",
    description:
      "Tell SocialBoost your topics and goals. Wake up to a full week of drafts, scheduled at the exact moments your audience is online.",
    badge: "Calendar",
    accent: "from-purple-500/30 to-pink-400/20",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden="true">
        <rect
          x="3"
          y="5"
          width="18"
          height="16"
          rx="3"
          stroke="currentColor"
          strokeWidth="1.6"
        />
        <path
          d="M3 10h18M8 3v4M16 3v4"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        <circle cx="8" cy="15" r="1.2" fill="currentColor" />
        <circle cx="12" cy="15" r="1.2" fill="currentColor" />
        <circle cx="16" cy="15" r="1.2" fill="currentColor" />
      </svg>
    ),
  },
  {
    title: "Hooks engineered to stop the scroll",
    description:
      "Every post is built from a library of 200+ proven hook patterns — analyzed across 5M+ viral LinkedIn posts and continuously updated.",
    badge: "Engagement",
    accent: "from-amber-400/30 to-orange-500/20",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden="true">
        <path
          d="M13 2L4 14h7l-1 8 9-12h-7l1-8z"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    title: "One-click publishing on autopilot",
    description:
      "Connect LinkedIn once. Approve drafts in seconds — or set SocialBoost to fully autonomous mode and let it publish for you.",
    badge: "Automation",
    accent: "from-emerald-400/30 to-teal-500/20",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden="true">
        <path
          d="M3 12a9 9 0 1 0 3-6.7"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        <path
          d="M3 4v5h5"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M11 8v5l3 2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: "Real analytics, not vanity metrics",
    description:
      "See what's actually growing your audience. SocialBoost tracks profile visits, follower quality, and inbound DMs — not just likes.",
    badge: "Analytics",
    accent: "from-rose-400/30 to-pink-500/20",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden="true">
        <path
          d="M3 21h18M5 18V10M10 18V6M15 18v-7M20 18v-4"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    title: "Smart inbox &amp; comment co-pilot",
    description:
      "SocialBoost drafts thoughtful replies for every comment and DM in your voice. You hit send. Conversations turn into customers.",
    badge: "Co-pilot",
    accent: "from-indigo-400/30 to-blue-500/20",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden="true">
        <path
          d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
];

export default function Features() {
  return (
    <section
      id="features"
      className="relative py-24 sm:py-32 scroll-mt-24"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <SectionHeader
          eyebrow="Everything you need"
          title={
            <>
              A full content team.{" "}
              <span className="gradient-text">Compressed into one app.</span>
            </>
          }
          description="From the first idea to the last engagement metric, SocialBoost handles the entire LinkedIn growth loop — so you can focus on the work that actually matters."
        />

        <div className="mt-16 grid grid-cols-1 gap-5 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature, i) => (
            <article
              key={feature.title}
              className="card-glow group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-white/[0.01] p-6 transition-transform duration-500 hover:-translate-y-1"
              style={{
                animation: "fade-up 0.9s cubic-bezier(0.22, 1, 0.36, 1) both",
                animationDelay: `${i * 80}ms`,
              }}
            >
              <div
                className={`pointer-events-none absolute -inset-px rounded-2xl bg-gradient-to-br ${feature.accent} opacity-0 transition-opacity duration-500 group-hover:opacity-100`}
              />
              <div className="relative">
                <div className="flex items-center justify-between">
                  <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-blue-300 transition-colors group-hover:text-white">
                    {feature.icon}
                  </div>
                  <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-slate-400">
                    {feature.badge}
                  </span>
                </div>

                <h3
                  className="mt-5 text-lg font-semibold text-white"
                  dangerouslySetInnerHTML={{ __html: feature.title }}
                />
                <p
                  className="mt-2 text-sm leading-relaxed text-slate-400"
                  dangerouslySetInnerHTML={{ __html: feature.description }}
                />

                <div className="mt-6 flex items-center gap-1.5 text-xs font-medium text-blue-300 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  Learn more
                  <svg
                    className="h-3 w-3 transition-transform group-hover:translate-x-0.5"
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
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
