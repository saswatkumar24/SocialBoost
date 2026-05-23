export default function Hero() {
  return (
    <section className="relative isolate overflow-hidden pt-32 sm:pt-40 lg:pt-44">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div className="grid-overlay absolute inset-0 opacity-60" />
        <div className="absolute left-1/2 top-32 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-violet-500/25 blur-[120px] animate-glow" />
        <div className="absolute right-[-10%] top-10 h-[420px] w-[420px] rounded-full bg-pink-500/20 blur-[120px] animate-glow [animation-delay:1.2s]" />
        <div className="absolute left-[-10%] top-72 h-[380px] w-[380px] rounded-full bg-cyan-500/20 blur-[120px] animate-glow [animation-delay:2.4s]" />
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <div className="scroll-fade inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-slate-300 backdrop-blur-sm [animation-delay:0.05s]">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            <span>New</span>
            <span className="text-slate-500">·</span>
            <span>Voice cloning &amp; smart scheduling are live</span>
            <svg
              className="h-3 w-3 text-slate-400"
              viewBox="0 0 16 16"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M6 4l4 4-4 4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <h1
            className="scroll-fade mt-6 text-4xl font-semibold tracking-tight text-white sm:text-6xl lg:text-7xl [animation-delay:0.15s]"
            style={{ fontFeatureSettings: "'ss01', 'ss02'" }}
          >
            Grow on LinkedIn.{" "}
            <span className="relative inline-block">
              <span className="gradient-text">On autopilot.</span>
              <svg
                className="absolute -bottom-3 left-0 w-full"
                viewBox="0 0 300 12"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M2 9 C 60 2, 120 2, 180 6 S 280 4, 298 8"
                  stroke="url(#hero-underline)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="hero-underline" x1="0" y1="0" x2="300" y2="0">
                    <stop offset="0%" stopColor="#60a5fa" />
                    <stop offset="50%" stopColor="#a78bfa" />
                    <stop offset="100%" stopColor="#22d3ee" />
                  </linearGradient>
                </defs>
              </svg>
            </span>
          </h1>

          <p className="scroll-fade mx-auto mt-8 max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg [animation-delay:0.3s]">
            SocialBoost connects to your LinkedIn, learns your voice from a few posts,
            and writes high-performing content for you — published on the perfect
            schedule. Spend zero hours on socials. Build a real audience.
          </p>

          <div className="scroll-fade mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row [animation-delay:0.45s]">
            <a
              href="/sign-up"
              className="btn-shine group relative inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 px-6 py-3.5 text-sm font-semibold text-white shadow-xl shadow-blue-500/30 transition-all hover:scale-[1.02] hover:shadow-blue-500/50"
            >
              <svg
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M20.447 20.452H16.89v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.268 2.37 4.268 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.063 2.063 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
              <span>Start free with LinkedIn</span>
              <svg
                className="h-4 w-4 transition-transform group-hover:translate-x-1"
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
            </a>
            <a
              href="#showcase"
              className="group inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:border-white/30 hover:bg-white/10"
            >
              <span className="relative flex h-7 w-7 items-center justify-center rounded-full bg-white/10 transition-colors group-hover:bg-white/20">
                <svg
                  className="h-3 w-3 translate-x-[1px] text-white"
                  viewBox="0 0 12 12"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M2 1.5a.5.5 0 0 1 .77-.42l7 4.5a.5.5 0 0 1 0 .84l-7 4.5A.5.5 0 0 1 2 10.5v-9z" />
                </svg>
              </span>
              For Demo click here
            </a>
          </div>

          <div className="scroll-fade mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-xs text-slate-400 [animation-delay:0.6s]">
            <span className="flex items-center gap-1.5">
              <CheckIcon /> No credit card required
            </span>
            <span className="flex items-center gap-1.5">
              <CheckIcon /> 14-day free trial
            </span>
            <span className="flex items-center gap-1.5">
              <CheckIcon /> Cancel anytime
            </span>
          </div>
        </div>

        <div className="scroll-fade relative mx-auto mt-16 max-w-6xl [animation-delay:0.75s] sm:mt-20">
          <div className="pointer-events-none absolute inset-x-12 -bottom-10 h-32 rounded-[40px] bg-blue-500/30 blur-3xl" />
          <ProductPreview />
        </div>
      </div>
    </section>
  );
}

function CheckIcon() {
  return (
    <svg
      className="h-4 w-4 text-emerald-400"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="8" cy="8" r="7.25" stroke="currentColor" strokeOpacity="0.4" strokeWidth="1.2" />
      <path
        d="M5 8.5l2 2 4-5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ProductPreview() {
  return (
    <div className="card-glow group relative overflow-hidden rounded-3xl border border-white/10 bg-slate-950/60 p-2 shadow-[0_30px_120px_-30px_rgba(59,130,246,0.5)] backdrop-blur-xl">
      <div className="overflow-hidden rounded-2xl border border-white/5 bg-gradient-to-br from-slate-950 via-slate-950 to-slate-900">
        <div className="flex items-center justify-between border-b border-white/5 bg-slate-900/60 px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-rose-500/80" />
            <span className="h-3 w-3 rounded-full bg-amber-400/80" />
            <span className="h-3 w-3 rounded-full bg-emerald-500/80" />
          </div>
          <div className="flex items-center gap-2 rounded-md border border-white/5 bg-slate-950/60 px-3 py-1 text-[11px] text-slate-400">
            <svg className="h-3 w-3" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path
                d="M11 7V5a3 3 0 1 0-6 0v2M4 7h8v6H4z"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            app.socialboost.ai/studio
          </div>
          <div className="w-12" />
        </div>

        <div className="grid grid-cols-1 gap-0 lg:grid-cols-[260px_1fr_320px]">
          <aside className="hidden border-r border-white/5 bg-slate-950/40 p-4 lg:block">
            <div className="mb-4 flex items-center gap-2 rounded-lg bg-white/5 p-2">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500" />
              <div className="flex-1">
                <div className="text-xs font-semibold text-white">Sarah Chen</div>
                <div className="text-[10px] text-slate-400">Founder, Linear AI</div>
              </div>
            </div>
            <nav className="space-y-1 text-xs">
              {[
                { label: "Studio", active: true, icon: "✦" },
                { label: "Calendar", icon: "▣" },
                { label: "Analytics", icon: "▲" },
                { label: "Voice profile", icon: "♬" },
                { label: "Inspiration", icon: "✿" },
                { label: "Settings", icon: "⚙" },
              ].map((item) => (
                <div
                  key={item.label}
                  className={`flex items-center gap-2 rounded-md px-2 py-2 ${
                    item.active
                      ? "bg-gradient-to-r from-blue-500/20 to-purple-500/10 text-white"
                      : "text-slate-400"
                  }`}
                >
                  <span className="text-sm">{item.icon}</span>
                  {item.label}
                </div>
              ))}
            </nav>
          </aside>

          <main className="p-5 lg:p-7">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <div className="text-xs uppercase tracking-wider text-blue-400">
                  AI Studio
                </div>
                <h3 className="mt-1 text-sm font-semibold text-white">
                  Draft for Tuesday — 9:14 AM
                </h3>
              </div>
              <div className="flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-2.5 py-1 text-[10px] font-medium text-emerald-300">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                Generating
              </div>
            </div>

            <div className="rounded-xl border border-white/5 bg-slate-900/40 p-4">
              <div className="mb-3 flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500" />
                <div>
                  <div className="text-sm font-semibold text-white">Sarah Chen</div>
                  <div className="text-[11px] text-slate-400">
                    Founder &amp; CEO at Linear AI · 1st
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Posted just now · <span className="text-blue-400">🌐</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-[13px] leading-relaxed text-slate-200">
                <p className="font-medium">
                  Three years ago, I almost shut Linear AI down.
                </p>
                <p className="text-slate-300">
                  We had 47 users, $0 in revenue, and a runway measured in weeks.
                  Every advisor told me to pivot. Instead, I doubled down on the
                  one thing customers loved.
                </p>
                <p className="text-slate-300">
                  Today we just crossed{" "}
                  <span className="font-semibold text-white">$10M ARR</span>.
                </p>
                <p className="text-slate-300">
                  Here&apos;s the counterintuitive lesson I learned about focus
                  <span className="ml-0.5 inline-block h-3.5 w-px translate-y-0.5 animate-blink bg-blue-400" />
                </p>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-3 text-[11px]">
                <div className="flex items-center gap-3 text-slate-400">
                  <span className="flex items-center gap-1">👍 1.2k</span>
                  <span className="flex items-center gap-1">💬 243 comments</span>
                  <span className="flex items-center gap-1">↗ 86 reposts</span>
                </div>
                <div className="text-slate-500">predicted reach</div>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <button className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] font-medium text-slate-200 transition-colors hover:bg-white/10">
                ✨ Regenerate
              </button>
              <button className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] font-medium text-slate-200 transition-colors hover:bg-white/10">
                Make it punchier
              </button>
              <button className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] font-medium text-slate-200 transition-colors hover:bg-white/10">
                Add a CTA
              </button>
              <div className="ml-auto flex items-center gap-2">
                <button className="rounded-lg border border-white/10 px-3 py-1.5 text-[11px] font-medium text-slate-300 transition-colors hover:bg-white/5">
                  Save draft
                </button>
                <button className="rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 px-3 py-1.5 text-[11px] font-semibold text-white shadow-md shadow-blue-500/30">
                  Schedule post
                </button>
              </div>
            </div>
          </main>

          <aside className="hidden border-l border-white/5 bg-slate-950/40 p-5 lg:block">
            <div className="text-[11px] uppercase tracking-wider text-slate-500">
              Performance forecast
            </div>
            <div className="mt-3 grid grid-cols-2 gap-3">
              {[
                { label: "Reach", value: "12.4k", delta: "+38%" },
                { label: "Engagement", value: "9.2%", delta: "+2.1%" },
                { label: "Profile views", value: "846", delta: "+74%" },
                { label: "Followers", value: "+128", delta: "vs. avg" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-lg border border-white/5 bg-slate-900/60 p-3"
                >
                  <div className="text-[10px] text-slate-400">{stat.label}</div>
                  <div className="mt-1 text-sm font-semibold text-white">
                    {stat.value}
                  </div>
                  <div className="text-[10px] text-emerald-400">{stat.delta}</div>
                </div>
              ))}
            </div>

            <div className="mt-5">
              <div className="text-[11px] uppercase tracking-wider text-slate-500">
                Voice match
              </div>
              <div className="mt-2 flex items-end justify-between gap-1.5 rounded-lg border border-white/5 bg-slate-900/60 p-3">
                {[40, 60, 75, 88, 70, 95, 80, 92, 84, 70, 60, 78].map((h, i) => (
                  <span
                    key={i}
                    className="block w-1.5 rounded-full bg-gradient-to-t from-blue-500 to-purple-400 animate-pulse-soft"
                    style={{
                      height: `${h}%`,
                      animationDelay: `${i * 0.08}s`,
                    }}
                  />
                ))}
              </div>
              <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400">
                <span>Authenticity</span>
                <span className="font-medium text-white">94%</span>
              </div>
            </div>

            <div className="mt-5 rounded-lg border border-white/5 bg-gradient-to-br from-blue-500/10 to-purple-500/10 p-3">
              <div className="text-[11px] font-semibold text-white">
                Best time to post
              </div>
              <div className="mt-1 text-[10px] text-slate-400">
                Tuesday at 9:14 AM EST
              </div>
              <div className="mt-2 text-[10px] text-blue-300">
                +47% engagement vs your average
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
