import SectionHeader from "./SectionHeader";

export default function CTA() {
  return (
    <section id="contact" className="relative py-24 sm:py-32 scroll-mt-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <SectionHeader
          eyebrow="Contact Support"
          title={
            <>
              Have questions?{" "}
              <span className="gradient-text">Get in touch directly.</span>
            </>
          }
          description="Whether you need help setting up custom autopilot schedules, have questions about the beta, or want to share feedback, we are here for you."
        />

        <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2 max-w-4xl mx-auto">
          {/* Email Support Card */}
          <div className="card-glow relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-white/[0.01] p-8 backdrop-blur-xl">
            <div
              aria-hidden
              className="pointer-events-none absolute -right-16 -top-16 h-36 w-36 rounded-full bg-violet-500/10 blur-2xl"
            />
            <div className="flex flex-col h-full justify-between gap-6">
              <div>
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10 text-violet-300 border border-violet-500/20 shadow-md shadow-violet-500/5">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="mt-4 text-lg font-semibold text-white">Email Support</h3>
                <p className="mt-2 text-sm text-slate-400">
                  Drop us a line anytime. We respond within a few hours for all account, technical, or custom interest enquiries.
                </p>
                <div className="mt-4 font-mono text-sm text-violet-300">saswat24@gmail.com</div>
              </div>
              <div>
                <a
                  href="mailto:saswat24@gmail.com"
                  className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-semibold text-zinc-200 transition-colors hover:bg-white/10 hover:text-white"
                >
                  <span>Send an Email</span>
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Call & WhatsApp Card */}
          <div className="card-glow relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-white/[0.01] p-8 backdrop-blur-xl">
            <div
              aria-hidden
              className="pointer-events-none absolute -right-16 -top-16 h-36 w-36 rounded-full bg-emerald-500/10 blur-2xl"
            />
            <div className="flex flex-col h-full justify-between gap-6">
              <div>
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 shadow-md shadow-emerald-500/5">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                  </svg>
                </div>
                <h3 className="mt-4 text-lg font-semibold text-white">Call / WhatsApp</h3>
                <p className="mt-2 text-sm text-slate-400">
                  Prefer direct messaging or calls? Reach out on mobile or send a message directly to our WhatsApp support line.
                </p>
                <div className="mt-4 font-mono text-sm text-emerald-300">+91 9908849156</div>
              </div>
              <div>
                <a
                  href="https://wa.me/919908849156"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-2.5 text-sm font-semibold text-emerald-300 transition-colors hover:bg-emerald-500/20"
                >
                  <span>Chat on WhatsApp</span>
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
