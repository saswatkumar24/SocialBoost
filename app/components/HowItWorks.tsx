import SectionHeader from "./SectionHeader";

const STEPS = [
  {
    number: "01",
    title: "Connect your LinkedIn",
    description:
      "One secure click via official LinkedIn OAuth. We never ask for your password and you can disconnect any time.",
    visual: (
      <div className="relative flex h-full items-center justify-center">
        <div className="relative flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/5 border border-white/10">
            <svg className="h-7 w-7 text-blue-300" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M20.447 20.452H16.89v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.268 2.37 4.268 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.063 2.063 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
          </div>
          <div className="flex flex-col gap-1.5">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="h-1 w-8 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 animate-pulse-soft"
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </div>
          <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/30">
            <svg className="h-6 w-6 text-white" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M5 13l4 4L19 7"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="absolute -inset-1 rounded-2xl border border-blue-400/40 animate-pulse" />
          </div>
        </div>
      </div>
    ),
  },
  {
    number: "02",
    title: "Train your AI voice",
    description:
      "Paste 3 of your favorite past posts. Our voice model captures your tone, vocabulary, and quirks in 90 seconds.",
    visual: (
      <div className="space-y-2">
        <div className="rounded-lg border border-white/5 bg-slate-900/60 px-3 py-2.5 text-[11px] text-slate-300">
          <div className="text-[10px] uppercase tracking-wider text-slate-500">
            Sample post 1
          </div>
          <div className="mt-1 truncate">
            &quot;The best founders I know all share one habit…&quot;
          </div>
        </div>
        <div className="rounded-lg border border-white/5 bg-slate-900/60 px-3 py-2.5 text-[11px] text-slate-300">
          <div className="text-[10px] uppercase tracking-wider text-slate-500">
            Sample post 2
          </div>
          <div className="mt-1 truncate">
            &quot;I used to think product-market fit was a moment…&quot;
          </div>
        </div>
        <div className="rounded-lg border border-blue-400/30 bg-gradient-to-br from-blue-500/15 to-purple-500/10 px-3 py-2.5">
          <div className="flex items-center justify-between">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-blue-300">
              Voice fingerprint
            </div>
            <div className="text-[10px] font-medium text-emerald-300">
              94% match
            </div>
          </div>
          <div className="mt-2 flex items-end gap-0.5">
            {[60, 75, 50, 90, 70, 85, 65, 92, 78, 88, 70, 80, 60, 95].map(
              (h, i) => (
                <span
                  key={i}
                  className="block w-1 rounded-full bg-gradient-to-t from-blue-500 to-cyan-300"
                  style={{ height: `${h * 0.4}px` }}
                />
              )
            )}
          </div>
        </div>
      </div>
    ),
  },
  {
    number: "03",
    title: "Set your topics &amp; goals",
    description:
      "Tell SocialBoost what you want to be known for. Pick a posting cadence. We handle topic research and angle generation for you.",
    visual: (
      <div className="space-y-2.5">
        <div className="flex flex-wrap gap-1.5">
          {["AI startups", "B2B SaaS", "Founder lessons", "Hiring", "+3"].map(
            (tag) => (
              <span
                key={tag}
                className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] text-slate-200"
              >
                {tag}
              </span>
            )
          )}
        </div>
        <div className="rounded-lg border border-white/5 bg-slate-900/60 p-3">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-400">Posting cadence</span>
            <span className="font-medium text-white">5×/week</span>
          </div>
          <div className="mt-2 grid grid-cols-7 gap-1">
            {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
              <div
                key={`${d}-${i}`}
                className={`flex h-7 items-center justify-center rounded-md text-[10px] font-medium ${
                  i < 5
                    ? "bg-gradient-to-br from-blue-500/30 to-purple-500/20 text-white border border-blue-400/30"
                    : "border border-white/5 bg-slate-950/40 text-slate-500"
                }`}
              >
                {d}
              </div>
            ))}
          </div>
        </div>
        <div className="flex items-center justify-between rounded-lg border border-white/5 bg-slate-900/60 px-3 py-2.5">
          <span className="text-[11px] text-slate-400">Goal</span>
          <span className="text-[11px] font-medium text-white">
            +1k qualified followers
          </span>
        </div>
      </div>
    ),
  },
  {
    number: "04",
    title: "Approve, schedule, repeat",
    description:
      "Review tomorrow's post in seconds. Tweak with one click — or flip on full autopilot and let SocialBoost publish for you.",
    visual: (
      <div className="space-y-2.5">
        {[
          { time: "Mon · 9:14 AM", title: "How I closed $2M in 14 days", state: "scheduled" },
          { time: "Tue · 11:02 AM", title: "3 hiring mistakes I keep making", state: "approved" },
          { time: "Wed · 8:30 AM", title: "AI is not a product. Here's why.", state: "draft" },
        ].map((p) => (
          <div
            key={p.title}
            className="flex items-center justify-between gap-3 rounded-lg border border-white/5 bg-slate-900/60 p-3"
          >
            <div className="flex min-w-0 items-center gap-2.5">
              <div
                className={`h-2 w-2 shrink-0 rounded-full ${
                  p.state === "scheduled"
                    ? "bg-emerald-400"
                    : p.state === "approved"
                      ? "bg-blue-400"
                      : "bg-amber-400"
                }`}
              />
              <div className="min-w-0">
                <div className="truncate text-[11px] font-medium text-white">
                  {p.title}
                </div>
                <div className="text-[10px] text-slate-500">{p.time}</div>
              </div>
            </div>
            <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] capitalize text-slate-300">
              {p.state}
            </span>
          </div>
        ))}
      </div>
    ),
  },
];

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="relative py-24 sm:py-32 scroll-mt-24"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[400px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-500/15 blur-[140px]"
      />

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <SectionHeader
          eyebrow="How it works"
          title={
            <>
              From zero to a{" "}
              <span className="gradient-text">growing audience</span> in 4 steps.
            </>
          }
          description="Set up takes about 6 minutes. After that, SocialBoost runs in the background and you wake up to drafts, scheduled posts, and engagement reports."
        />

        <div className="mt-20 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {STEPS.map((step, i) => (
            <div
              key={step.number}
              className="card-glow group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-white/[0.01] p-6 sm:p-8"
            >
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-[1fr_auto] sm:items-start">
                <div>
                  <div className="flex items-center gap-3">
                    <span
                      className="text-5xl font-bold leading-none tracking-tighter text-transparent sm:text-6xl"
                      style={{
                        WebkitTextStroke: "1px rgba(148,163,184,0.4)",
                      }}
                    >
                      {step.number}
                    </span>
                    <span className="hidden h-px w-12 bg-gradient-to-r from-white/30 to-transparent sm:block" />
                  </div>
                  <h3
                    className="mt-4 text-xl font-semibold text-white sm:text-2xl"
                    dangerouslySetInnerHTML={{ __html: step.title }}
                  />
                  <p
                    className="mt-3 text-sm leading-relaxed text-slate-400"
                    dangerouslySetInnerHTML={{ __html: step.description }}
                  />
                </div>

                <div className="w-full max-w-xs rounded-xl border border-white/5 bg-slate-950/40 p-4">
                  {step.visual}
                </div>
              </div>

              {i < STEPS.length - 1 && (
                <div className="absolute -bottom-6 left-1/2 hidden h-12 w-px -translate-x-1/2 bg-gradient-to-b from-white/10 to-transparent lg:block" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
