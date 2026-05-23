import Logo from "./Logo";

const COLUMNS = [
  {
    heading: "Product",
    links: [
      { label: "AI Studio", href: "#showcase" },
      { label: "Voice cloning", href: "#features" },
      { label: "Calendar", href: "#features" },
      { label: "Analytics", href: "#features" },
      { label: "Comment co-pilot", href: "#features" },
      { label: "Pricing", href: "#pricing" },
    ],
  },
  {
    heading: "Resources",
    links: [
      { label: "Hook library", href: "#" },
      { label: "Post inspiration", href: "#" },
      { label: "LinkedIn growth guide", href: "#" },
      { label: "Voice samples", href: "#" },
      { label: "Changelog", href: "#" },
      { label: "Status", href: "#" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About", href: "#" },
      { label: "Customers", href: "#testimonials" },
      { label: "Careers", href: "#" },
      { label: "Press kit", href: "#" },
      { label: "Affiliate program", href: "#" },
      { label: "Contact", href: "#" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "Privacy policy", href: "#" },
      { label: "Terms of service", href: "#" },
      { label: "Security", href: "#" },
      { label: "DPA", href: "#" },
      { label: "Cookie settings", href: "#" },
    ],
  },
];

const SOCIALS: { label: string; href: string; icon: React.ReactNode }[] = [
  {
    label: "LinkedIn",
    href: "#",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
        <path d="M20.447 20.452H16.89v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.268 2.37 4.268 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.063 2.063 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    label: "X / Twitter",
    href: "#",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    label: "YouTube",
    href: "#",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136C4.495 20.455 12 20.455 12 20.455s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
  {
    label: "GitHub",
    href: "#",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
        <path d="M12 .5C5.73.5.5 5.74.5 12.04c0 5.09 3.29 9.4 7.86 10.93.58.11.79-.25.79-.55 0-.27-.01-1.16-.02-2.1-3.2.7-3.87-1.36-3.87-1.36-.52-1.32-1.27-1.68-1.27-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.02 1.75 2.69 1.24 3.34.95.1-.74.4-1.24.72-1.53-2.55-.29-5.24-1.28-5.24-5.7 0-1.26.45-2.29 1.18-3.09-.12-.29-.51-1.46.11-3.04 0 0 .96-.31 3.16 1.18a10.97 10.97 0 0 1 5.76 0c2.2-1.49 3.16-1.18 3.16-1.18.62 1.58.23 2.75.11 3.04.74.8 1.18 1.83 1.18 3.09 0 4.43-2.69 5.4-5.26 5.69.41.36.78 1.05.78 2.13 0 1.54-.01 2.78-.01 3.16 0 .3.21.66.8.55 4.56-1.53 7.85-5.84 7.85-10.92C23.5 5.74 18.27.5 12 .5z" />
      </svg>
    ),
  },
];

export default function Footer() {
  return (
    <footer className="relative mt-20 border-t border-white/10 bg-gradient-to-b from-slate-950/40 to-slate-950 pb-10 pt-20">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 mx-auto h-[1px] w-3/4 max-w-5xl bg-gradient-to-r from-transparent via-violet-400/40 to-transparent"
      />

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1.6fr_2fr]">
          <div>
            <Logo />
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-slate-400">
              SocialBoost is the AI co-pilot that grows your LinkedIn audience for you
              — writing, scheduling, and engaging on autopilot in your authentic
              voice.
            </p>

            <form className="mt-6 flex max-w-sm overflow-hidden rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm">
              <input
                type="email"
                placeholder="you@company.com"
                aria-label="Email address"
                className="flex-1 bg-transparent px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none"
              />
              <button
                type="button"
                className="bg-gradient-to-br from-blue-500 to-indigo-600 px-4 py-2.5 text-xs font-semibold text-white"
              >
                Get the newsletter
              </button>
            </form>

            <div className="mt-6 flex items-center gap-2">
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-slate-300 transition-colors hover:bg-white/10 hover:text-white"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {COLUMNS.map((col) => (
              <div key={col.heading}>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                  {col.heading}
                </h4>
                <ul className="mt-4 space-y-2.5">
                  {col.links.map((l) => (
                    <li key={l.label}>
                      <a
                        href={l.href}
                        className="text-sm text-slate-400 transition-colors hover:text-white"
                      >
                        {l.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 flex flex-col items-start justify-between gap-4 border-t border-white/10 pt-8 text-xs text-slate-400 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400" />
            <span>All systems operational</span>
            <span className="text-slate-600">·</span>
            <span>SOC 2 Type II</span>
            <span className="text-slate-600">·</span>
            <span>GDPR-ready</span>
          </div>
          <p>
            © {new Date().getFullYear()} SocialBoost Labs, Inc. All rights reserved.
            Made with ♥ for builders.
          </p>
        </div>

        <div
          aria-hidden="true"
          className="relative mt-10 select-none overflow-hidden"
        >
          <h2 className="bg-gradient-to-b from-white/[0.06] to-transparent bg-clip-text text-center text-[18vw] font-bold leading-none tracking-tighter text-transparent">
            SocialBoost.
          </h2>
        </div>
      </div>
    </footer>
  );
}
