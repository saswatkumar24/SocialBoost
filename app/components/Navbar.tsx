"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Logo from "./Logo";

const NAV_LINKS = [
  { href: "#features", label: "Features" },
  { href: "#how-it-works", label: "How it works" },
  { href: "#showcase", label: "AI Studio" },
  { href: "#pricing", label: "Pricing" },
  { href: "#faq", label: "FAQ" },
  { href: "#contact", label: "Contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          scrolled ? "pt-2" : "pt-4"
        }`}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div
            className={`flex items-center justify-between rounded-2xl transition-all duration-500 ${
              scrolled
                ? "border border-white/10 bg-slate-950/70 px-4 py-2.5 shadow-[0_8px_40px_-12px_rgba(0,0,0,0.6)] backdrop-blur-xl"
                : "border border-transparent px-2 py-3"
            }`}
          >
            <a href="#" className="group">
              <Logo />
            </a>

            <nav className="hidden items-center gap-1 lg:flex">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="relative rounded-lg px-3.5 py-2 text-sm font-medium text-slate-300 transition-colors hover:text-white"
                >
                  <span className="relative z-10">{link.label}</span>
                  <span className="absolute inset-0 -z-0 rounded-lg bg-white/0 transition-colors duration-300 group-hover:bg-white/5" />
                </a>
              ))}
            </nav>

            <div className="hidden items-center gap-2 lg:flex">
              <Link
                href="/sign-in"
                className="rounded-lg px-3.5 py-2 text-sm font-medium text-slate-300 transition-colors hover:text-white"
              >
                Sign in
              </Link>
              <Link
                href="/sign-up"
                className="btn-shine group relative inline-flex items-center gap-2 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition-all hover:shadow-blue-500/40"
              >
                <span>Get started</span>
                <svg
                  className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
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
              </Link>
            </div>

            <button
              type="button"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen((v) => !v)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white transition-colors hover:bg-white/10 lg:hidden"
            >
              <span className="sr-only">Toggle navigation</span>
              <div className="relative h-4 w-5">
                <span
                  className={`absolute left-0 right-0 top-0 h-0.5 rounded-full bg-current transition-all duration-300 ${
                    mobileOpen ? "top-1/2 -translate-y-1/2 rotate-45" : ""
                  }`}
                />
                <span
                  className={`absolute left-0 right-0 top-1/2 h-0.5 -translate-y-1/2 rounded-full bg-current transition-all duration-300 ${
                    mobileOpen ? "opacity-0" : "opacity-100"
                  }`}
                />
                <span
                  className={`absolute left-0 right-0 bottom-0 h-0.5 rounded-full bg-current transition-all duration-300 ${
                    mobileOpen ? "bottom-1/2 translate-y-1/2 -rotate-45" : ""
                  }`}
                />
              </div>
            </button>
          </div>
        </div>
      </header>

      <div
        className={`fixed inset-0 z-40 transition-opacity duration-300 lg:hidden ${
          mobileOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <div
          className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
        <div
          className={`absolute inset-x-4 top-20 rounded-2xl border border-white/10 bg-slate-950/95 p-6 shadow-2xl backdrop-blur-xl transition-all duration-300 ${
            mobileOpen ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0"
          }`}
        >
          <nav className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="rounded-lg px-4 py-3 text-base font-medium text-slate-200 transition-colors hover:bg-white/5 hover:text-white"
              >
                {link.label}
              </a>
            ))}
          </nav>
          <div className="mt-4 flex flex-col gap-2 border-t border-white/10 pt-4">
            <Link
              href="/sign-in"
              onClick={() => setMobileOpen(false)}
              className="rounded-lg px-4 py-3 text-center text-sm font-medium text-slate-300 transition-colors hover:bg-white/5 hover:text-white"
            >
              Sign in
            </Link>
            <Link
              href="/sign-up"
              onClick={() => setMobileOpen(false)}
              className="rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 px-4 py-3 text-center text-sm font-semibold text-white shadow-lg shadow-blue-500/25"
            >
              Get started
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
