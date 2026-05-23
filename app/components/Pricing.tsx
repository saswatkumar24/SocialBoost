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
          eyebrow="Pricing"
          title={
            <>
              Simple plans.{" "}
              <span className="gradient-text">Outsized returns.</span>
            </>
          }
          description="Start free. Cancel anytime. Most users hit ROI within their first three published posts."
        />

        <div className="mt-8 flex justify-center">
          <div className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 p-1 text-xs">
            <button className="rounded-full bg-white/10 px-4 py-1.5 font-medium text-white">
              Monthly
            </button>
            <button className="rounded-full px-4 py-1.5 font-medium text-slate-400">
              Yearly{" "}
              <span className="ml-1 rounded-full bg-emerald-400/15 px-1.5 py-0.5 text-[10px] text-emerald-300">
                −20%
              </span>
            </button>
          </div>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-3 lg:items-stretch">
          {TIERS.map((tier) => (
            <div
              key={tier.name}
              className={`card-glow relative flex flex-col overflow-hidden rounded-2xl border p-8 ${
                tier.popular
                  ? "border-blue-400/40 bg-gradient-to-b from-blue-500/[0.08] to-purple-500/[0.04] lg:scale-[1.02]"
                  : "border-white/10 bg-gradient-to-b from-white/[0.04] to-white/[0.01]"
              }`}
            >
              {tier.popular && (
                <>
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -top-32 right-0 h-64 w-64 rounded-full bg-blue-500/30 blur-[120px]"
                  />
                  <div className="absolute right-6 top-6 rounded-full border border-blue-400/40 bg-blue-500/15 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-blue-200">
                    Most popular
                  </div>
                </>
              )}

              <div>
                <h3 className="text-base font-semibold text-white">
                  {tier.name}
                </h3>
                <p className="mt-1 text-sm text-slate-400">{tier.description}</p>
              </div>

              <div className="mt-6 flex items-baseline gap-1">
                <span className="text-5xl font-bold tracking-tight text-white">
                  {tier.price}
                </span>
                <span className="text-sm text-slate-400">{tier.period}</span>
              </div>

              <a
                href="/sign-up"
                className={`mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition-all btn-shine ${
                  tier.popular
                    ? "bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/45"
                    : "border border-white/15 bg-white/5 text-white hover:bg-white/10"
                }`}
              >
                {tier.cta}
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
              </a>

              <div className="mt-8 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

              <ul className="mt-6 space-y-3">
                {tier.features.map((f) => (
                  <li
                    key={f}
                    className="flex items-start gap-2.5 text-sm text-slate-300"
                  >
                    <span
                      className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full ${
                        tier.popular
                          ? "bg-blue-500/20 text-blue-300"
                          : "bg-white/10 text-emerald-300"
                      }`}
                    >
                      <svg
                        className="h-2.5 w-2.5"
                        viewBox="0 0 12 12"
                        fill="none"
                        aria-hidden="true"
                      >
                        <path
                          d="M2 6.5l2.5 2.5L10 3.5"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                    <span dangerouslySetInnerHTML={{ __html: f }} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <p className="mt-10 text-center text-xs text-slate-400">
          All prices in USD · 14-day free trial on every plan · No credit card
          required
        </p>
      </div>
    </section>
  );
}
