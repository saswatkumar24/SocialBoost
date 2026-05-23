import Link from "next/link";

export const metadata = {
  title: "Contact Support — SocialBoost",
};

export default function ContactPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] p-6 space-y-6">
      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-white/[0.06] bg-zinc-900/40 p-8 backdrop-blur-xl shadow-2xl">
        {/* Glow backdrop effects */}
        <div aria-hidden className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-gradient-to-br from-violet-500/20 via-cyan-500/10 to-transparent blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute -left-24 -bottom-24 h-72 w-72 rounded-full bg-gradient-to-tr from-fuchsia-500/15 via-violet-500/5 to-transparent blur-3xl" />

        <div className="relative flex flex-col items-center space-y-6 text-center">
          {/* Support Icon */}
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-violet-500/10 text-violet-400 border border-violet-500/20 shadow-lg shadow-violet-500/5 animate-pulse">
            <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Contact Support
            </h1>
            <p className="text-sm text-zinc-400 leading-relaxed max-w-sm mx-auto">
              Need to add more than 2 custom autopilot interests, or require assistance with scheduling? Get in touch directly.
            </p>
          </div>

          <div className="w-full space-y-3 pt-2">
            {/* Email link button */}
            <a
              href="mailto:saswat24@gmail.com"
              className="flex w-full items-center justify-center gap-3 rounded-xl border border-white/[0.08] bg-white/[0.03] px-5 py-3.5 text-sm font-semibold text-zinc-200 transition-all hover:bg-white/[0.08] hover:text-white"
            >
              <svg className="h-4 w-4 text-violet-400" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
              <span>Email: saswat24@gmail.com</span>
            </a>

            {/* WhatsApp link button */}
            <a
              href="https://wa.me/919908849156"
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-5 py-3.5 text-sm font-semibold text-emerald-300 transition-all hover:bg-emerald-500/20 hover:text-emerald-100"
            >
              <svg className="h-4 w-4 text-emerald-400" viewBox="0 0 24 24" fill="currentColor">
                <path fillRule="evenodd" clipRule="evenodd" d="M12.004 2C6.48 2 2 6.48 2 12.004c0 1.848.502 3.578 1.378 5.07l-1.34 4.896 5.01-1.314c1.436.786 3.076 1.238 4.82 1.238 5.523 0 10.003-4.48 10.003-10.004C21.874 6.48 17.527 2 12.004 2zm5.776 14.152c-.252.71-.97 1.29-1.636 1.43-.593.125-1.37.224-3.953-.846-3.3-1.368-5.427-4.723-5.59-4.945-.164-.22-1.306-1.737-1.306-3.313 0-1.577.825-2.353 1.12-2.67.295-.316.656-.395.875-.395.218 0 .437 0 .628.01.202.01.475-.078.743.565.273.658.93 2.27 1.01 2.435.083.165.138.356.028.577-.11.22-.165.357-.328.547-.164.19-.344.42-.492.565-.164.164-.337.34-.145.67.193.33.858 1.417 1.84 2.293.85.757 1.564 1.013 1.903 1.18.337.165.534.137.734-.094.2-.232.85-.99.1.082-.25.33-.518.55-.743.774-.223.224-.447.164-.783-.002-.336-.165-1.423-.524-2.71-1.674-1.002-.894-1.678-2-1.875-2.33-.197-.33-.02-.508.145-.673.148-.148.33-.383.493-.574.164-.192.218-.328.328-.547.11-.218.055-.41-.027-.575-.082-.165-.742-1.785-1.018-2.45-.27-.648-.528-.56-.723-.57-.188-.01-.403-.01-.617-.01-.692 0-1.815.26-2.5 1-.685.74-2.62 2.56-2.62 6.24 0 3.68 2.68 7.23 3.05 7.74.37.51 5.27 8.046 12.77 11.286 1.785.77 3.178 1.23 4.267 1.576 1.794.57 3.428.49 4.717.298 1.436-.214 2.96-.874 3.376-2.072z" />
              </svg>
              <span>Call / WhatsApp: +91 9908849156</span>
            </a>
          </div>

          <div className="pt-4 border-t border-white/[0.04] w-full flex justify-center">
            <Link
              href="/app/schedule"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-violet-300 hover:text-violet-200 transition-colors"
            >
              <svg className="h-3 w-3" viewBox="0 0 16 16" fill="currentColor">
                <path fillRule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z" />
              </svg>
              <span>Back to Schedule</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
