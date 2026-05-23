export default function CTA() {
  return (
    <section id="cta" className="relative py-24 sm:py-32 scroll-mt-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="card-glow relative isolate overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-violet-600/20 via-indigo-600/15 to-pink-600/20 px-6 py-16 text-center sm:px-12 sm:py-24">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-10"
          >
            <div className="grid-overlay absolute inset-0 opacity-40" />
            <div className="absolute -left-20 top-0 h-96 w-96 rounded-full bg-violet-500/25 blur-[140px] animate-glow" />
            <div className="absolute -right-20 bottom-0 h-96 w-96 rounded-full bg-pink-500/20 blur-[140px] animate-glow [animation-delay:1.5s]" />
            <div className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/15 blur-[120px]" />
          </div>

          <div className="mx-auto max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              Free for 14 days · No credit card
            </span>

            <h2 className="mt-6 text-4xl font-semibold tracking-tight text-white sm:text-6xl">
              Your audience is waiting.
              <br />
              <span className="gradient-text-sweep">Start showing up.</span>
            </h2>

            <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-slate-200 sm:text-lg">
              Connect your LinkedIn in 60 seconds. Let SocialBoost handle the writing,
              the timing, and the analytics. You handle the work that actually
              moves the needle.
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <a
                href="/sign-up"
                className="btn-shine group relative inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-semibold text-slate-950 shadow-2xl shadow-white/20 transition-all hover:scale-[1.02]"
              >
                <svg
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M20.447 20.452H16.89v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.268 2.37 4.268 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.063 2.063 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
                <span>Connect LinkedIn — start free</span>
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
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/20"
              >
                See it in action
              </a>
            </div>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs text-slate-300">
              <span className="flex items-center gap-1.5">
                <CheckIcon /> Setup in 6 minutes
              </span>
              <span className="flex items-center gap-1.5">
                <CheckIcon /> SOC 2 Type II certified
              </span>
              <span className="flex items-center gap-1.5">
                <CheckIcon /> Cancel anytime
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CheckIcon() {
  return (
    <svg
      className="h-4 w-4 text-emerald-300"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="8" cy="8" r="7.25" stroke="currentColor" strokeOpacity="0.5" strokeWidth="1.2" />
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
