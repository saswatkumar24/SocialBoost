import SectionHeader from "./SectionHeader";

const FEATURED_TESTIMONIALS = [
  {
    quote:
      "I used to dread Sunday nights — that's when I'd panic-write the week's content. SocialBoost handed me back 4 hours a week and tripled my inbound DMs in 60 days. It's the highest-ROI tool I've ever paid for.",
    author: "Maya Patel",
    role: "Founder, Bloom HR",
    avatarBg: "from-rose-400 to-pink-500",
    metric: { value: "+312%", label: "Inbound DMs in 60 days" },
  },
  {
    quote:
      "I was skeptical that an AI could sound like me. Then my own co-founder reposted a SocialBoost-written post and said 'classic you.' We hit 60k followers six months later. I'm a believer.",
    author: "James Okafor",
    role: "Co-founder &amp; CEO, Modal Labs",
    avatarBg: "from-blue-400 to-indigo-500",
    metric: { value: "60k", label: "Followers in 6 months" },
  },
];

const TESTIMONIALS = [
  {
    quote:
      "Best $49 I spend every month. My LinkedIn went from a graveyard to my #1 lead source.",
    author: "Lena Rodriguez",
    role: "Founder, Tabbed",
    initials: "LR",
    bg: "from-amber-400 to-orange-500",
  },
  {
    quote:
      "The voice cloning is uncanny. My team genuinely could not tell which posts I wrote and which SocialBoost drafted.",
    author: "David Kim",
    role: "VP Marketing, Hex",
    initials: "DK",
    bg: "from-emerald-400 to-teal-500",
  },
  {
    quote:
      "I went from posting 1×/month with anxiety to 4×/week with zero stress. My personal brand finally exists.",
    author: "Priya Shah",
    role: "Solo founder, Threadlite",
    initials: "PS",
    bg: "from-purple-400 to-pink-500",
  },
  {
    quote:
      "We use SocialBoost for our exec team. 6 of our leaders post consistently — for the first time ever.",
    author: "Marco Bianchi",
    role: "Head of Comms, Stripe",
    initials: "MB",
    bg: "from-cyan-400 to-blue-500",
  },
  {
    quote:
      "SocialBoost's analytics finally showed me which posts actually drive pipeline. Game changer for B2B.",
    author: "Hannah Liu",
    role: "Demand gen lead, Vercel",
    initials: "HL",
    bg: "from-fuchsia-400 to-rose-500",
  },
  {
    quote:
      "It's like hiring a ghostwriter who never sleeps and costs less than a coffee a day. No-brainer.",
    author: "Tobias Reyes",
    role: "Founder, Slate",
    initials: "TR",
    bg: "from-indigo-400 to-blue-500",
  },
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="relative py-24 sm:py-32 scroll-mt-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <SectionHeader
          eyebrow="Loved by 12,000+ creators"
          title={
            <>
              Founders, operators &amp; creators{" "}
              <span className="gradient-text">are growing on autopilot.</span>
            </>
          }
          description="Real stories from real users — from solo founders building a name to executive teams turning LinkedIn into their #1 channel."
        />

        {/* Featured quotes — 2 large cards */}
        <div className="mt-16 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {FEATURED_TESTIMONIALS.map((t) => (
            <figure
              key={t.author}
              className="card-glow relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.05] to-white/[0.01] p-8 sm:p-10"
            >
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-blue-500/20 blur-[100px]"
              />
              <svg
                className="h-10 w-10 text-blue-400/80"
                viewBox="0 0 32 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M0 24V12C0 5.373 5.373 0 12 0v6a6 6 0 0 0-6 6h6v12H0zm20 0V12c0-6.627 5.373-12 12-12v6a6 6 0 0 0-6 6h6v12H20z" />
              </svg>

              <blockquote className="mt-6 text-lg leading-relaxed text-slate-100 sm:text-xl">
                <span dangerouslySetInnerHTML={{ __html: `&ldquo;${t.quote}&rdquo;` }} />
              </blockquote>

              <div className="mt-8 flex items-center justify-between gap-4">
                <figcaption className="flex items-center gap-3">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br ${t.avatarBg} text-sm font-semibold text-white`}
                  >
                    {t.author
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">
                      {t.author}
                    </div>
                    <div
                      className="text-xs text-slate-400"
                      dangerouslySetInnerHTML={{ __html: t.role }}
                    />
                  </div>
                </figcaption>
                <div className="text-right">
                  <div className="text-2xl font-bold text-white">
                    {t.metric.value}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    {t.metric.label}
                  </div>
                </div>
              </div>
            </figure>
          ))}
        </div>

        {/* Grid of smaller testimonials */}
        <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <figure
              key={t.author}
              className="card-glow group relative rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-white/[0.01] p-6 transition-all hover:-translate-y-1"
              style={{
                animation: "fade-up 0.9s cubic-bezier(0.22, 1, 0.36, 1) both",
                animationDelay: `${i * 70}ms`,
              }}
            >
              <div className="flex items-center gap-1 text-amber-400">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <svg
                    key={idx}
                    className="h-3.5 w-3.5"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M8 0l2.18 5.13L16 5.84l-4.4 3.85 1.36 5.62L8 12.27 3.04 15.31 4.4 9.69 0 5.84l5.82-.71L8 0z" />
                  </svg>
                ))}
              </div>

              <blockquote className="mt-4 text-sm leading-relaxed text-slate-200">
                &ldquo;{t.quote}&rdquo;
              </blockquote>

              <figcaption className="mt-6 flex items-center gap-3 border-t border-white/5 pt-4">
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br ${t.bg} text-xs font-semibold text-white`}
                >
                  {t.initials}
                </div>
                <div>
                  <div className="text-xs font-semibold text-white">
                    {t.author}
                  </div>
                  <div className="text-[11px] text-slate-400">{t.role}</div>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-center gap-3 text-center">
          <div className="flex -space-x-2">
            {[
              "from-rose-400 to-pink-500",
              "from-blue-400 to-indigo-500",
              "from-amber-400 to-orange-500",
              "from-emerald-400 to-teal-500",
              "from-purple-400 to-pink-500",
              "from-cyan-400 to-blue-500",
            ].map((g, i) => (
              <span
                key={i}
                className={`h-9 w-9 rounded-full border-2 border-slate-950 bg-gradient-to-br ${g}`}
              />
            ))}
          </div>
          <p className="text-sm text-slate-300">
            <span className="font-semibold text-white">12,000+</span> creators
            already growing with SocialBoost.
          </p>
        </div>
      </div>
    </section>
  );
}
