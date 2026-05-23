const COMPANIES = [
  "Linear AI",
  "Notion",
  "Vercel",
  "Figma",
  "Stripe",
  "Loom",
  "Ramp",
  "Anthropic",
  "Supabase",
  "SocialBoost Labs",
];

export default function LogoCloud() {
  return (
    <section className="relative py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="text-center">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">
            Trusted by founders, operators &amp; creators at
          </p>
        </div>

        <div className="marquee-mask relative mt-10 overflow-hidden">
          <div className="flex w-max animate-marquee items-center gap-12 sm:gap-20">
            {[...COMPANIES, ...COMPANIES].map((name, i) => (
              <span
                key={`${name}-${i}`}
                className="text-2xl font-semibold tracking-tight text-slate-400/70 transition-colors hover:text-white sm:text-3xl"
                style={{ fontFamily: "var(--font-geist-sans)" }}
              >
                {name}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-x-6 gap-y-4 text-center sm:grid-cols-4">
          {[
            { value: "12,000+", label: "Active creators" },
            { value: "4.9/5", label: "Avg user rating" },
            { value: "2.7M+", label: "Posts published" },
            { value: "38%", label: "Avg engagement lift" },
          ].map((stat) => (
            <div key={stat.label}>
              <div className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                {stat.value}
              </div>
              <div className="mt-1 text-xs text-slate-400">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
