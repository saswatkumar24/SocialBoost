import SectionHeader from "./SectionHeader";

const TIERS = [
  {
    name: "Starter",
    description: "For creators dipping their toes in.",
    price: "$19",
    period: "/month",
    cta: "Start free trial",
    popular: false,
    features: [
      "Up to 8 AI-generated posts/month",
      "1 LinkedIn account",
      "Voice cloning (3 samples)",
      "Smart scheduling",
      "Basic analytics",
      "Email support",
    ],
  },
  {
    name: "Creator",
    description: "For founders and operators serious about growth.",
    price: "$49",
    period: "/month",
    cta: "Start free trial",
    popular: true,
    features: [
      "Unlimited AI-generated posts",
      "1 LinkedIn account",
      "Advanced voice cloning + tone presets",
      "Optimal scheduling AI",
      "Comment &amp; DM co-pilot",
      "Full analytics &amp; reach forecasts",
      "Priority support",
      "Inspiration feed across 5M posts",
    ],
  },
  {
    name: "Team",
    description: "For agencies and exec teams running multiple profiles.",
    price: "$199",
    period: "/month",
    cta: "Talk to sales",
    popular: false,
    features: [
      "Everything in Creator",
      "Up to 5 LinkedIn accounts",
      "Per-person voice profiles",
      "Approval workflows &amp; brand guardrails",
      "Team analytics dashboard",
      "Slack &amp; Notion integrations",
      "Dedicated success manager",
    ],
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="relative py-24 sm:py-32 scroll-mt-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <SectionHeader
          eyebrow="Pricing Plan"
          title={
            <>
              Now 100% Free.{" "}
              <span className="gradient-text">No paywalls.</span>
            </>
          }
          description="We are currently in public beta. Enjoy full, unrestricted access to every AI and scheduling feature at zero cost."
        />

        <div className="mt-16 max-w-3xl mx-auto">
          <div className="card-glow relative overflow-hidden rounded-3xl border border-blue-400/30 bg-gradient-to-b from-blue-500/[0.08] to-purple-500/[0.04] p-8 sm:p-10 text-center">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 h-64 w-96 rounded-full bg-blue-500/20 blur-[120px]"
            />
            
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-300">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Public Beta Special
            </span>

            <h3 className="mt-6 text-2xl font-bold text-white">Coming Soon — Now Free for Everything</h3>
            <p className="mt-3 text-sm text-slate-400 max-w-lg mx-auto">
              Our standard plans are coming soon. In the meantime, sign up now to get full access to unlimited drafts, autopilot scheduling slots, and AI voice matching.
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-1">
              <span className="text-5xl font-extrabold tracking-tight text-white">$0</span>
              <span className="text-xs font-mono uppercase tracking-[0.2em] text-slate-500 mt-1">free forever during beta</span>
            </div>

            <div className="mt-8 flex justify-center">
              <a
                href="/sign-up"
                className="btn-shine group inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-semibold text-slate-950 shadow-lg shadow-white/10 hover:scale-[1.02] transition-transform"
              >
                <span>Get started for free</span>
                <svg className="h-4 w-4 transition-transform group-hover:translate-x-0.5" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M3 8h10m0 0L9 4m4 4l-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            </div>

            <div className="mt-10 border-t border-white/5 pt-8">
              <div className="grid gap-4 sm:grid-cols-2 text-left max-w-xl mx-auto text-sm text-slate-300">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-500/20 text-blue-300">✓</span>
                  <span>Unlimited AI Drafting & Suggestion</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-500/20 text-blue-300">✓</span>
                  <span>Autopilot Scheduler Slots</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-500/20 text-blue-300">✓</span>
                  <span>Custom AI Post Refinement</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-500/20 text-blue-300">✓</span>
                  <span>1 Connected LinkedIn Profile</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
