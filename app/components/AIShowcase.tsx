"use client";

import { useState } from "react";
import SectionHeader from "./SectionHeader";

export default function AIShowcase() {
  const [activeTab, setActiveTab] = useState<"drafting" | "scheduling">("drafting");

  return (
    <section id="showcase" className="relative py-24 sm:py-32 scroll-mt-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <SectionHeader
          eyebrow="Interactive Demo"
          title={
            <>
              Experience our AI engine{" "}
              <span className="gradient-text">in real-time.</span>
            </>
          }
          description="See how SocialBoost helps you draft professional content and orchestrate a fully autonomous scheduling queue."
        />

        {/* Tab Selector */}
        <div className="mt-12 flex justify-center">
          <div className="inline-flex rounded-xl border border-white/[0.08] bg-zinc-950/60 p-1 backdrop-blur-xl">
            <button
              onClick={() => setActiveTab("drafting")}
              className={`inline-flex items-center gap-2 rounded-lg px-4.5 py-2 text-sm font-semibold tracking-wide transition-all ${
                activeTab === "drafting"
                  ? "bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white shadow-md"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <svg className="h-4 w-4" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 1.5l1.5 3.5 3.5 1.5-3.5 1.5L8 11.5 6.5 8 3 6.5 6.5 5 8 1.5z" />
              </svg>
              <span>AI Studio (Drafting)</span>
            </button>
            <button
              onClick={() => setActiveTab("scheduling")}
              className={`inline-flex items-center gap-2 rounded-lg px-4.5 py-2 text-sm font-semibold tracking-wide transition-all ${
                activeTab === "scheduling"
                  ? "bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white shadow-md"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              <span>Autopilot (Scheduling)</span>
            </button>
          </div>
        </div>

        {activeTab === "drafting" ? (
          /* Drafting Tab */
          <div className="mt-12 grid grid-cols-1 items-stretch gap-8 lg:grid-cols-2 animate-fade-in">
            {/* Input card */}
            <div className="card-glow relative flex flex-col justify-between rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-white/[0.01] p-6 sm:p-8">
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-500/15 text-blue-300">
                      <svg viewBox="0 0 16 16" fill="none" className="h-3.5 w-3.5" aria-hidden="true">
                        <path d="M8 1v14M1 8h14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                      </svg>
                    </span>
                    <span className="text-xs font-medium uppercase tracking-wider text-slate-300">
                      Input · Rough idea
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500">42 words</span>
                </div>

                <div className="mt-5 rounded-xl border border-white/5 bg-slate-950/60 p-5 font-mono text-sm leading-relaxed text-slate-300">
                  <p>
                    <span className="text-slate-500">{">"}</span> Spent yesterday with
                    a CFO who finally cancelled their{" "}
                    <span className="rounded bg-blue-500/15 px-1 text-blue-300">$84k/yr</span>{" "}
                    analytics tool because we did the same job in a Notion doc + 3
                    Loom videos. Want to write about why most B2B tools are bloated.
                    Make it sting a little.
                  </p>
                  <span className="ml-1 inline-block h-4 w-1.5 translate-y-0.5 animate-blink bg-blue-400" />
                </div>
              </div>

              <div className="mt-5 space-y-4">
                <div className="flex flex-wrap items-center gap-2">
                  {["Tone: Direct", "Length: Medium", "Goal: Inbound leads", "Hook: Bold claim"].map((c) => (
                    <span key={c} className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] text-slate-300">
                      {c}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between border-t border-white/5 pt-4">
                  <span className="text-[11px] text-slate-500">
                    SocialBoost will analyze 5M+ posts to find the best angle
                  </span>
                  <button className="btn-shine inline-flex items-center gap-2 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 px-3 py-1.5 text-[11px] font-semibold text-white shadow-md shadow-blue-500/30">
                    ✨ Generate
                  </button>
                </div>
              </div>
            </div>

            {/* Output card */}
            <div className="card-glow relative flex flex-col justify-between rounded-2xl border border-white/10 bg-gradient-to-b from-blue-500/[0.04] to-purple-500/[0.02] p-6 sm:p-8">
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-400/15 text-emerald-300">
                      <svg viewBox="0 0 16 16" fill="none" className="h-3.5 w-3.5" aria-hidden="true">
                        <path d="M3 8.5l3 3 7-7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                    <span className="text-xs font-medium uppercase tracking-wider text-slate-300">
                      Output · Ready to publish
                    </span>
                  </div>
                  <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-2 py-0.5 text-[10px] font-medium text-emerald-300">
                    94% voice match
                  </span>
                </div>

                <div className="mt-5 rounded-xl border border-white/5 bg-slate-950/60 p-5 text-sm leading-relaxed text-slate-100">
                  <p className="font-semibold text-white">
                    Yesterday a CFO told me he just cancelled an $84,000/year
                    analytics contract.
                  </p>
                  <p className="mt-3 text-slate-300">
                    What replaced it? A Notion doc and 3 Loom videos.
                  </p>
                  <p className="mt-3 text-slate-300">
                    Most B2B software isn&apos;t solving problems anymore. It&apos;s
                    solving the founder&apos;s need to look serious.
                  </p>
                  <p className="mt-3 text-slate-300">
                    The unsexy truth: your team probably doesn&apos;t need a new tool.
                    They need 30 minutes of clarity from you.
                  </p>
                  <p className="mt-3 text-slate-300">Three questions to ask before any new contract:</p>
                  <p className="mt-3 text-slate-300">
                    1. What workflow does this replace?
                    <br />
                    2. Who on my team has actually used it for 30 days?
                    <br />
                    3. Could a $20 doc do 80% of the job?
                  </p>
                  <p className="mt-3 text-slate-300">
                    Be honest. Most of the time, the answer is yes.
                  </p>
                </div>
              </div>

              <div className="mt-5 space-y-4">
                <div className="grid grid-cols-3 gap-2 text-center">
                  {[
                    { label: "Predicted reach", value: "14.2k" },
                    { label: "Est. engagement", value: "9.8%" },
                    { label: "Hook score", value: "A+" },
                  ].map((m) => (
                    <div key={m.label} className="rounded-lg border border-white/5 bg-slate-900/60 px-3 py-2">
                      <div className="text-sm font-semibold text-white">{m.value}</div>
                      <div className="text-[10px] text-slate-400">{m.label}</div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-end gap-2 border-t border-white/5 pt-4">
                  <button className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] font-medium text-slate-200">
                    Regenerate
                  </button>
                  <button className="rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 px-3 py-1.5 text-[11px] font-semibold text-white shadow-md shadow-emerald-500/30">
                    Schedule for Tuesday
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Scheduling Tab (Demo Screenshot of our Scheduling/Autopilot features) */
          <div className="mt-12 grid grid-cols-1 items-stretch gap-8 lg:grid-cols-2 animate-fade-in">
            {/* Autopilot Interest Configuration Block */}
            <div className="card-glow relative flex flex-col justify-between rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-white/[0.01] p-6 sm:p-8">
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-500/15 text-violet-300">
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
                      </svg>
                    </span>
                    <span className="text-xs font-medium uppercase tracking-wider text-slate-300">
                      Autopilot Configuration
                    </span>
                  </div>
                  <span className="rounded-full border border-violet-500/30 bg-violet-500/10 px-2 py-0.5 text-[10px] font-medium text-violet-300">
                    Active Topics
                  </span>
                </div>

                <div className="mt-5 space-y-4">
                  {/* LinkedIn Connected state */}
                  <div className="flex items-center justify-between rounded-xl border border-emerald-500/20 bg-emerald-500/[0.02] p-3 text-xs">
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded-full bg-gradient-to-br from-blue-400 to-purple-500" />
                      <div>
                        <span className="font-semibold text-white">Sarah Chen</span>
                        <span className="text-slate-400 ml-1.5">(LinkedIn Connected)</span>
                      </div>
                    </div>
                    <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  </div>

                  {/* Configured Autopilot Topics list */}
                  <div className="space-y-2">
                    <div className="text-[10px] font-mono uppercase tracking-[0.1em] text-slate-500">Configured Autopilot Interests</div>
                    <div className="rounded-xl border border-white/5 bg-slate-950/40 p-3 space-y-2.5">
                      <div className="flex items-center justify-between border-b border-white/5 pb-2 text-xs">
                        <div>
                          <span className="font-semibold text-white">Software Engineering</span>
                          <span className="block text-[10px] text-slate-400 mt-0.5">Focus: Software architecture & scaling</span>
                        </div>
                        <span className="text-[10px] font-mono text-violet-300 bg-violet-500/10 px-2 py-0.5 rounded-md border border-violet-400/20">
                          1 slot/wk
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <div>
                          <span className="font-semibold text-white">AI & Machine Learning</span>
                          <span className="block text-[10px] text-slate-400 mt-0.5">Focus: Generative models & practical tooling</span>
                        </div>
                        <span className="text-[10px] font-mono text-violet-300 bg-violet-500/10 px-2 py-0.5 rounded-md border border-violet-400/20">
                          2 slots/wk
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Autopilot Tuning Interests checkboxes */}
                  <div className="space-y-2">
                    <div className="text-[10px] font-mono uppercase tracking-[0.1em] text-slate-500">Interest Tuning</div>
                    <div className="flex flex-wrap gap-1.5">
                      {["Software Engineering", "AI & Machine Learning", "Leadership", "Startups", "Career Advice"].map((cat, i) => (
                        <span
                          key={cat}
                          className={`rounded-lg border px-2 py-1 text-[10px] font-semibold ${
                            i < 2
                              ? "border-violet-500/40 bg-violet-500/15 text-violet-200"
                              : "border-white/[0.06] bg-white/[0.02] text-slate-400"
                          }`}
                        >
                          {i < 2 ? "✓ " : ""} {cat}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-white/5 pt-4">
                <span className="text-[11px] text-slate-500">
                  Autopilot dynamically queues relevant voice-matched posts.
                </span>
                <span className="text-[10px] font-semibold text-zinc-400">
                  Max 2 Custom Topics Allowed
                </span>
              </div>
            </div>

            {/* Upcoming queue board mockup */}
            <div className="card-glow relative flex flex-col justify-between rounded-2xl border border-white/10 bg-gradient-to-b from-blue-500/[0.04] to-purple-500/[0.02] p-6 sm:p-8">
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-400/15 text-emerald-300">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </span>
                    <span className="text-xs font-medium uppercase tracking-wider text-slate-300">
                      Upcoming Queue (Next 7 Days)
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400">Next 12 hours check</span>
                </div>

                <div className="mt-5 space-y-3">
                  {/* Item 1: Autopilot Slot */}
                  <div className="rounded-xl border border-dashed border-violet-500/30 bg-violet-500/[0.02] p-3.5 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">Monday at 9:00 AM</span>
                      <span className="inline-flex items-center gap-1 rounded-full border border-violet-400/30 bg-violet-500/15 px-2 py-0.5 text-[9px] font-semibold text-violet-200 uppercase tracking-wider">
                        🤖 Autopilot Slot
                      </span>
                    </div>
                    <div className="text-[11px] text-zinc-300 font-medium">Topic: AI & Machine Learning</div>
                    <p className="text-[10px] text-zinc-400 leading-normal">
                      AI Autopilot will automatically draft and queue a post about AI & Machine Learning 2 hours before this slot.
                    </p>
                  </div>

                  {/* Item 2: Fixed message post */}
                  <div className="rounded-xl border border-white/5 bg-slate-950/60 p-3.5 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">Tuesday at 2:30 PM</span>
                      <span className="inline-flex items-center gap-1 rounded-full border border-cyan-400/30 bg-cyan-500/10 px-2 py-0.5 text-[9px] font-semibold text-cyan-200 uppercase tracking-wider">
                        📝 Fixed Message
                      </span>
                    </div>
                    <div className="text-[11px] text-zinc-300 font-semibold truncate">Three years ago, I almost shut Linear AI down...</div>
                    <p className="text-[10px] text-slate-400 line-clamp-1">
                      We had 47 users, $0 in revenue, and a runway measured in weeks...
                    </p>
                  </div>

                  {/* Item 3: Autopilot Slot */}
                  <div className="rounded-xl border border-dashed border-violet-500/30 bg-violet-500/[0.02] p-3.5 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">Wednesday at 9:00 AM</span>
                      <span className="inline-flex items-center gap-1 rounded-full border border-violet-400/30 bg-violet-500/15 px-2 py-0.5 text-[9px] font-semibold text-violet-200 uppercase tracking-wider">
                        🤖 Autopilot Slot
                      </span>
                    </div>
                    <div className="text-[11px] text-zinc-300 font-medium">Topic: AI & Machine Learning</div>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-end gap-2 border-t border-white/5 pt-4">
                <button className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] font-medium text-slate-200">
                  Edit Autopilot Slots
                </button>
                <button className="rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 px-3 py-1.5 text-[11px] font-semibold text-white shadow-md shadow-violet-500/30">
                  Queue Fixed Message
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
