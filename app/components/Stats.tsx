const STATS = [
  {
    value: "+38%",
    label: "Avg engagement lift",
    sub: "vs. manual posting, in the first 30 days",
  },
  {
    value: "12 min",
    label: "Saved per post",
    sub: "From idea to scheduled, on every draft",
  },
  {
    value: "2.7M+",
    label: "Posts published",
    sub: "Through SocialBoost over the last 12 months",
  },
  {
    value: "9.4×",
    label: "ROI on average",
    sub: "Reported by users in our Q3 2025 survey",
  },
];

export default function Stats() {
  return (
    <section className="relative py-24 sm:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="card-glow relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-slate-950 via-slate-950 to-slate-900 p-8 sm:p-12 lg:p-16">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
          >
            <div className="absolute -left-20 -top-20 h-80 w-80 rounded-full bg-violet-500/20 blur-[120px]" />
            <div className="absolute -right-20 -bottom-20 h-80 w-80 rounded-full bg-purple-500/20 blur-[120px]" />
            <div className="grid-overlay absolute inset-0 opacity-30" />
          </div>

          <div className="relative grid grid-cols-1 gap-12 lg:grid-cols-[1fr_auto_2fr] lg:items-center">
            <div className="max-w-md">
              <span className="inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-400/5 px-3 py-1 text-xs font-medium uppercase tracking-wider text-violet-300">
                <span className="h-1 w-1 rounded-full bg-violet-400" />
                The numbers
              </span>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                Real growth.{" "}
                <span className="gradient-text">Measured every day.</span>
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-slate-300">
                We track every post, reply, and follower so you can stop guessing
                what works. These are the average results across our active user
                base.
              </p>
            </div>

            <span
              aria-hidden="true"
              className="hidden h-full w-px bg-gradient-to-b from-transparent via-white/10 to-transparent lg:block"
            />

            <dl className="grid grid-cols-2 gap-x-8 gap-y-10">
              {STATS.map((stat) => (
                <div key={stat.label}>
                  <dt className="text-xs font-medium uppercase tracking-wider text-slate-400">
                    {stat.label}
                  </dt>
                  <dd className="mt-2 text-4xl font-bold tracking-tight text-white sm:text-5xl">
                    <span className="bg-gradient-to-br from-white to-slate-300 bg-clip-text text-transparent">
                      {stat.value}
                    </span>
                  </dd>
                  <dd className="mt-2 max-w-[18rem] text-xs leading-relaxed text-slate-400">
                    {stat.sub}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}
