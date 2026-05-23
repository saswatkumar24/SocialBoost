import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="relative mt-20 border-t border-white/10 bg-slate-950 pb-12 pt-16">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 mx-auto h-[1px] w-3/4 max-w-5xl bg-gradient-to-r from-transparent via-blue-500/40 to-transparent"
      />

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
          <div>
            <Logo />
            <p className="mt-4 max-w-xs text-sm text-slate-400">
              SocialBoost is the AI co-pilot that grows your LinkedIn audience for you — writing, scheduling, and engaging on autopilot in your authentic voice.
            </p>
          </div>

          <div className="flex flex-col gap-6 sm:flex-row sm:gap-12">
            <div className="flex flex-col">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Email Support</span>
              <a
                href="mailto:saswat24@gmail.com"
                className="mt-2 text-sm text-slate-300 hover:text-white transition-colors"
              >
                saswat24@gmail.com
              </a>
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Call / WhatsApp</span>
              <a
                href="https://wa.me/919908849156"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 text-sm text-slate-300 hover:text-white transition-colors"
              >
                +91 9908849156
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/5 pt-8 text-xs text-slate-500 sm:flex-row">
          <p>© {new Date().getFullYear()} SocialBoost Labs, Inc. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-slate-400 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-slate-400 transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
