"use client";

import { useState } from "react";
import SectionHeader from "./SectionHeader";

const FAQS = [
  {
    q: "Is using SocialBoost safe for my LinkedIn account?",
    a: "Yes. SocialBoost uses LinkedIn's official API and OAuth — we never automate browser actions, scrape, or use your password. You're always within LinkedIn's terms of service, and you can revoke access at any time from your account settings.",
  },
  {
    q: "Will my posts actually sound like me?",
    a: "That's the whole point. SocialBoost trains a private voice profile from 3 of your past posts. Most users can't tell the difference, and our average voice-match score is 94%. You can also tweak your tone, intensity, and formality at any time — or hand-edit before publishing.",
  },
  {
    q: "Do I have to publish what SocialBoost writes?",
    a: "Never. SocialBoost defaults to 'review mode' — you approve every draft before it goes live. If you trust it enough, you can flip on full autopilot for any posting slot. You're always in control.",
  },
  {
    q: "What if I don't have content ideas?",
    a: "SocialBoost has you covered. Tell us your topics and goals once, and our research engine will surface fresh angles, news, and trends every week. You can also drop a transcript, voice note, or rough sentence — we'll turn it into a polished post.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Absolutely. No contracts, no annoying retention calls. One click in your dashboard and your subscription ends at the next billing cycle. Your account stays accessible in read-only mode for 30 days afterward.",
  },
  {
    q: "Do you support multiple LinkedIn accounts?",
    a: "Yes — on the Team plan. You can manage up to 5 LinkedIn accounts from a single workspace, with per-person voice profiles, approval workflows, and brand guardrails. Need more? Reach out for an Enterprise plan.",
  },
  {
    q: "Will SocialBoost spam my network?",
    a: "SocialBoost posts at most 1×/day per account, only at your chosen schedule, and never repeats content. We'd rather you grow slowly with great posts than burn your audience with mass output.",
  },
  {
    q: "How is my data handled?",
    a: "Your voice profile and post history are encrypted at rest and never shared with other users or used to train public models. We're SOC 2 Type II certified and GDPR-compliant. You can export or delete all your data with one click.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="relative py-24 sm:py-32 scroll-mt-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
          <div className="lg:sticky lg:top-32 lg:self-start">
            <SectionHeader
              align="left"
              eyebrow="Frequently asked"
              title={
                <>
                  Got questions?{" "}
                  <span className="gradient-text">We&apos;ve got answers.</span>
                </>
              }
              description="Still curious about something? Email us at hello@socialboost.ai and we'll get back to you within a few hours."
            />

            <a
              href="mailto:hello@socialboost.ai"
              className="mt-6 inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-white/10"
            >
              <svg
                className="h-4 w-4 text-blue-300"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Talk to a human
            </a>
          </div>

          <div className="divide-y divide-white/10 rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.03] to-white/[0.01]">
            {FAQS.map((faq, idx) => {
              const isOpen = openIndex === idx;
              return (
                <div key={faq.q}>
                  <button
                    type="button"
                    onClick={() => setOpenIndex(isOpen ? null : idx)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left text-base font-medium text-white transition-colors hover:bg-white/[0.02] sm:px-7 sm:py-6"
                  >
                    <span>{faq.q}</span>
                    <span
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 transition-transform duration-300 ${
                        isOpen ? "rotate-45 bg-blue-500/20 text-blue-300" : "text-slate-300"
                      }`}
                      aria-hidden="true"
                    >
                      <svg
                        className="h-3 w-3"
                        viewBox="0 0 12 12"
                        fill="none"
                      >
                        <path
                          d="M6 1v10M1 6h10"
                          stroke="currentColor"
                          strokeWidth="1.6"
                          strokeLinecap="round"
                        />
                      </svg>
                    </span>
                  </button>
                  <div
                    className={`grid overflow-hidden transition-[grid-template-rows] duration-500 ease-out ${
                      isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                    }`}
                  >
                    <div className="min-h-0">
                      <p className="px-6 pb-6 pr-14 text-sm leading-relaxed text-slate-400 sm:px-7 sm:pb-7">
                        {faq.a}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
