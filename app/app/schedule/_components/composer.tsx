"use client";

import { useRef, useState, useTransition, useEffect } from "react";
import Link from "next/link";
import {
  draftPostAction,
  loadTopicsAction,
  publishPostAction,
} from "@/app/app/content/actions";
import type { TopicSuggestion } from "@/lib/creator-profile-shared";
import { CONTENT_CATEGORIES } from "@/lib/creator-profile-shared";
import { MAX_QUEUE_BODY } from "@/lib/scheduling-shared";

import {
  scheduleFixedMessageAction,
  saveAiTopicScheduleAction,
  deleteAiTopicScheduleAction,
  generateTomorrowAiPostsAction,
  updateProfileCategoriesAction,
  refinePostAction,
} from "../actions";

type ComposerProps = {
  hasLinkedinConnection: boolean;
  scheduleActive: boolean;
  timezone: string;
  previewSlot: string | null;
  aiTopicSchedules: any[];
  creatorProfile: any;
};

type ActiveTab = "fixed" | "autopilot";

const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const CATEGORY_DEFAULT_PROMPTS: Record<string, string> = {
  "Software engineering": "Share practical software architecture tips, coding best practices, and lessons learned from building scalable systems.",
  "AI & machine learning": "Cover recent advancements in generative AI, neural network architectures, and practical tips for building AI-powered apps.",
  "Product management": "Explain product strategy, roadmap prioritization frameworks, and how to build features customers love.",
  "Startups & entrepreneurship": "Insights on launching a startup, finding product-market fit, raising funds, and scaling from 0 to 1.",
  "Marketing & growth": "Cover growth hacking strategies, content marketing, SEO, and paid acquisition tactics that work.",
  "Sales": "Tips on outbound sales strategies, closing deals, negotiation techniques, and building sales pipelines.",
  "Design & UX": "Lessons on user research, UI design principles, usability testing, and creating seamless user journeys.",
  "Data & analytics": "Explain data-driven decision making, metrics configuration, and modern data stack architectures.",
  "Leadership & management": "Advice on scaling engineering teams, remote leadership, fostering healthy engineering culture, and career growth.",
  "Career advice": "Actionable tips for resume writing, technical interview preparation, and negotiating job offers.",
  "Personal branding": "How to write engaging content online, build a professional brand, and share your technical journey.",
  "Finance & investing": "Insights on tech industry trends, startup valuation, and wealth building for software engineers.",
  "Productivity": "Share time management frameworks, developer productivity setups, and focus techniques.",
  "Remote work": "Tips for running async teams, remote work setups, and maintaining work-life balance.",
  "Hiring & recruiting": "How to design a technical interview process, attract top talent, and screen candidates effectively."
};

export default function Composer({
  hasLinkedinConnection,
  scheduleActive,
  timezone,
  previewSlot,
  aiTopicSchedules: initialAiSchedules,
  creatorProfile,
}: ComposerProps) {
  const [activeTab, setActiveTab] = useState<ActiveTab>("fixed");
  const [body, setBody] = useState("");
  const [feedback, setFeedback] = useState<{ kind: "idle" | "success" | "error"; message: string }>({
    kind: "idle",
    message: "",
  });

  // Fixed Post cadence configuration states
  const [isRecurring, setIsRecurring] = useState(false);
  const [dateTime, setDateTime] = useState("");
  const [daysOfWeek, setDaysOfWeek] = useState<number[]>([1]); // default Mon
  const [timesOfDay, setTimesOfDay] = useState<string[]>(["09:00"]);
  const [newTimeOfDay, setNewTimeOfDay] = useState("09:00");

  // Creator Profile Categories state
  const [profileCategories, setProfileCategories] = useState<string[]>(
    creatorProfile?.categories ?? []
  );
  // Local temporary selector state before saving
  const [selectedInterests, setSelectedInterests] = useState<string[]>(
    creatorProfile?.categories ?? []
  );

  // AI Autopilot states
  const [schedules, setSchedules] = useState<any[]>(initialAiSchedules);
  const [isAddingTopic, setIsAddingTopic] = useState(false);
  const [isCustomTopic, setIsCustomTopic] = useState(false);
  const [newTopicName, setNewTopicName] = useState("");
  const [newTopicBrief, setNewTopicBrief] = useState("");
  const [newTopicSlots, setNewTopicSlots] = useState<Array<{ day: number; time: string }>>([]);
  const [slotDay, setSlotDay] = useState(1);
  const [slotTime, setSlotTime] = useState("09:00");

  // AI Content suggestion states (Fixed Message tab)
  const [topics, setTopics] = useState<TopicSuggestion[]>([]);
  const [showTopics, setShowTopics] = useState(false);
  const [topicsError, setTopicsError] = useState<string | null>(null);
  const [activeTopic, setActiveTopic] = useState<TopicSuggestion | null>(null);

  const [topicsPending, startTopics] = useTransition();
  const [draftPending, startDraft] = useTransition();
  const [actionPending, startAction] = useTransition();
  const [showContactPopup, setShowContactPopup] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // Sync initial schedules and categories from props
  useEffect(() => {
    setSchedules(initialAiSchedules);
  }, [initialAiSchedules]);

  useEffect(() => {
    const cats = creatorProfile?.categories ?? [];
    setProfileCategories(cats);
    setSelectedInterests(cats);
  }, [creatorProfile]);

  // Set default standalone time to tomorrow at 9 AM
  useEffect(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(9, 0, 0, 0);
    const pad = (n: number) => String(n).padStart(2, "0");
    const formatted = `${tomorrow.getFullYear()}-${pad(tomorrow.getMonth() + 1)}-${pad(tomorrow.getDate())}T${pad(tomorrow.getHours())}:${pad(tomorrow.getMinutes())}`;
    setDateTime(formatted);
  }, []);

  const handleLoadTopics = () => {
    setTopicsError(null);
    setShowTopics(true);
    startTopics(async () => {
      const result = await loadTopicsAction();
      if (result.error) {
        setTopicsError(result.error);
        setTopics([]);
      } else {
        setTopics(result.topics ?? []);
      }
    });
  };

  const handlePickTopic = (topic: TopicSuggestion) => {
    setActiveTopic(topic);
    setFeedback({ kind: "idle", message: "" });
    startDraft(async () => {
      const result = await draftPostAction(topic);
      if (result.error) {
        setFeedback({ kind: "error", message: result.error });
      } else {
        setBody(result.body);
        setShowTopics(false);
        requestAnimationFrame(() => {
          textareaRef.current?.focus();
        });
      }
    });
  };

  const handleClearAi = () => {
    setActiveTopic(null);
    setShowTopics(false);
    setTopics([]);
    setTopicsError(null);
  };

  const [refinePending, setRefinePending] = useState(false);

  const handleRefine = async () => {
    if (!body.trim() || refinePending) return;
    setRefinePending(true);
    setFeedback({ kind: "idle", message: "" });
    try {
      const res = await refinePostAction(body);
      if (!res.ok) {
        setFeedback({ kind: "error", message: res.error ?? "Failed to refine post." });
      } else if (res.body) {
        setBody(res.body);
        setFeedback({ kind: "success", message: "Post refined successfully with AI!" });
        setTimeout(() => {
          setFeedback((prev) => prev.message === "Post refined successfully with AI!" ? { kind: "idle", message: "" } : prev);
        }, 4000);
      }
    } catch (err) {
      setFeedback({ kind: "error", message: "An unexpected error occurred during refinement." });
    } finally {
      setRefinePending(false);
    }
  };

  const [postNowPending, setPostNowPending] = useState(false);
  const [postUrl, setPostUrl] = useState<string | null>(null);

  useEffect(() => {
    setPostUrl(null);
  }, [body, activeTab]);

  const handlePostNow = async () => {
    if (!body.trim() || postNowPending) return;
    setPostNowPending(true);
    setPostUrl(null);
    setFeedback({ kind: "idle", message: "" });
    try {
      const res = await publishPostAction({ body });
      if (res.ok && res.postUrn) {
        const url = `https://www.linkedin.com/feed/update/${res.postUrn}`;
        setPostUrl(url);
        setFeedback({ kind: "success", message: "🚀 Successfully published to LinkedIn!" });
        setBody(""); // Clear the text area after successful post
      } else {
        setFeedback({
          kind: "error",
          message: res.error ?? "Failed to publish post to LinkedIn.",
        });
      }
    } catch (e) {
      setFeedback({ kind: "error", message: "An unexpected error occurred while posting." });
    } finally {
      setPostNowPending(false);
    }
  };

  // Submit Fixed Message (Standalone or Recurring)
  const handleScheduleFixed = () => {
    if (!body.trim()) return;

    if (!isRecurring && !dateTime) {
      setFeedback({ kind: "error", message: "Please select a date and time." });
      return;
    }
    if (isRecurring && daysOfWeek.length === 0) {
      setFeedback({ kind: "error", message: "Please select at least one day of the week." });
      return;
    }
    if (isRecurring && timesOfDay.length === 0) {
      setFeedback({ kind: "error", message: "Please add at least one publication time slot." });
      return;
    }

    setFeedback({ kind: "idle", message: "" });
    startAction(async () => {
      const res = await scheduleFixedMessageAction({
        body: body.trim(),
        is_recurring: isRecurring,
        scheduled_at: !isRecurring ? dateTime : undefined,
        days_of_week: isRecurring ? daysOfWeek : undefined,
        times_of_day: isRecurring ? timesOfDay : undefined,
      });

      if (!res.ok) {
        setFeedback({ kind: "error", message: res.error ?? "Failed to save post schedule." });
      } else {
        setFeedback({
          kind: "success",
          message: isRecurring
            ? "Recurring fixed post scheduled successfully!"
            : "One-time post queued successfully!",
        });
        setBody("");
        setActiveTopic(null);
      }
    });
  };

  // Toggle days for recurring posts
  const toggleRecurringDay = (day: number) => {
    setDaysOfWeek((prev) =>
      prev.includes(day)
        ? prev.filter((d) => d !== day)
        : [...prev, day].sort((a, b) => a - b)
    );
  };

  // Manage times of day for recurring posts
  const addRecurringTime = () => {
    const v = newTimeOfDay.trim();
    if (!v || timesOfDay.includes(v)) return;
    setTimesOfDay((prev) => [...prev, v].sort((a, b) => a.localeCompare(b)));
  };

  const removeRecurringTime = (t: string) => {
    setTimesOfDay((prev) => prev.filter((x) => x !== t));
  };

  // Toggling Category Interests in local state
  const handleToggleInterest = (category: string) => {
    setSelectedInterests((prev) => {
      if (prev.includes(category)) {
        return prev.filter((c) => c !== category);
      } else {
        if (prev.length >= 6) {
          setFeedback({ kind: "error", message: "You can select a maximum of 6 interests." });
          setTimeout(() => setFeedback({ kind: "idle", message: "" }), 5000);
          return prev;
        }
        return [...prev, category];
      }
    });
  };

  // Save Interests explicitly
  const handleSaveInterests = () => {
    setFeedback({ kind: "idle", message: "" });
    startAction(async () => {
      const res = await updateProfileCategoriesAction(selectedInterests);
      if (!res.ok) {
        setFeedback({ kind: "error", message: res.error ?? "Failed to update profile interests." });
      } else {
        setProfileCategories(selectedInterests);
        setFeedback({ kind: "success", message: "Profile interests saved successfully!" });
        setTimeout(() => setFeedback({ kind: "idle", message: "" }), 5000);
      }
    });
  };

  // Add slot to topic builder
  const handleAddSlotToTopic = () => {
    if (newTopicSlots.length >= 4) {
      setFeedback({ kind: "error", message: "Maximum of 4 schedule slots per week allowed for each topic." });
      setTimeout(() => setFeedback({ kind: "idle", message: "" }), 5000);
      return;
    }
    const dup = newTopicSlots.some((s) => s.day === slotDay && s.time === slotTime);
    if (dup) return;

    setNewTopicSlots((prev) =>
      [...prev, { day: slotDay, time: slotTime }].sort(
        (a, b) => a.day - b.day || a.time.localeCompare(b.time)
      )
    );
  };

  const handleRemoveSlotFromTopic = (idx: number) => {
    setNewTopicSlots((prev) => prev.filter((_, i) => i !== idx));
  };

  // Save AI Topic Autopilot Schedule
  const handleSaveTopic = async () => {
    if (schedules.length >= 7) {
      setFeedback({ kind: "error", message: "You can select a maximum of 7 autopilot topics." });
      return;
    }
    const topic = newTopicName.trim();
    const brief = newTopicBrief.trim();
    if (!topic || !brief) {
      setFeedback({ kind: "error", message: "Please specify both a topic name and brief prompt instructions." });
      return;
    }
    if (newTopicSlots.length === 0) {
      setFeedback({ kind: "error", message: "Add at least one weekly slot for this topic." });
      return;
    }

    setFeedback({ kind: "idle", message: "" });
    startAction(async () => {
      const res = await saveAiTopicScheduleAction({
        topic_name: topic,
        prompt_brief: brief,
        slots: newTopicSlots,
      });
      if (!res.ok) {
        setFeedback({ kind: "error", message: res.error ?? "Failed to save topic." });
      } else {
        setFeedback({ kind: "success", message: `Autopilot topic "${topic}" saved successfully!` });
        setIsAddingTopic(false);
        setNewTopicName("");
        setNewTopicBrief("");
        setNewTopicSlots([]);
        
        // Reload page to refresh lists
        window.location.reload();
      }
    });
  };

  // Prefill Topic from Selected Profile Interest
  const handleConfigureInterestAutopilot = (interest: string) => {
    setNewTopicName(interest);
    setNewTopicBrief(CATEGORY_DEFAULT_PROMPTS[interest] ?? `Provide engaging insights, helpful resources, and community lessons on ${interest}.`);
    setNewTopicSlots([{ day: 1, time: "09:00" }]);
    setIsCustomTopic(false);
    setIsAddingTopic(true);
    setFeedback({ kind: "idle", message: "" });
  };

  const handleDeleteTopic = (id: string) => {
    setFeedback({ kind: "idle", message: "" });
    startAction(async () => {
      const res = await deleteAiTopicScheduleAction(id);
      if (!res.ok) {
        setFeedback({ kind: "error", message: res.error ?? "Failed to delete topic." });
      } else {
        setFeedback({ kind: "success", message: "Topic deleted successfully." });
        setSchedules((prev) => prev.filter((s) => s.id !== id));
      }
    });
  };

  const handleGenerateTomorrow = () => {
    setFeedback({ kind: "idle", message: "" });
    startAction(async () => {
      const res = await generateTomorrowAiPostsAction();
      if (!res.ok) {
        setFeedback({ kind: "error", message: res.error ?? "Failed to generate autopilot posts." });
      } else {
        setFeedback({
          kind: "success",
          message: res.count > 0
            ? `Successfully generated and queued ${res.count} posts for tomorrow's slots!`
            : "No slots found or posts already queued for tomorrow's times.",
        });
      }
    });
  };

  const charCount = body.length;
  const overLimit = charCount > MAX_QUEUE_BODY;
  const busy = draftPending || actionPending || postNowPending;

  const hasUnsavedInterests =
    JSON.stringify([...selectedInterests].sort()) !==
    JSON.stringify([...profileCategories].sort());

  return (
    <section className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-zinc-900/40 p-6 backdrop-blur-xl">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-gradient-to-br from-violet-500/30 via-fuchsia-500/20 to-transparent blur-3xl"
      />

      <div className="relative flex flex-col gap-6">
        {/* Tab Headers */}
        <div className="flex border-b border-white/[0.06]">
          <button
            onClick={() => {
              setActiveTab("fixed");
              setFeedback({ kind: "idle", message: "" });
            }}
            className={`flex-1 pb-3 text-sm font-semibold tracking-wide border-b-2 transition-colors ${
              activeTab === "fixed"
                ? "border-violet-500 text-white"
                : "border-transparent text-zinc-400 hover:text-zinc-200"
            }`}
          >
            Fixed Message
          </button>
          <button
            onClick={() => {
              setActiveTab("autopilot");
              setFeedback({ kind: "idle", message: "" });
            }}
            className={`flex-1 pb-3 text-sm font-semibold tracking-wide border-b-2 transition-colors ${
              activeTab === "autopilot"
                ? "border-violet-500 text-white"
                : "border-transparent text-zinc-400 hover:text-zinc-200"
            }`}
          >
            AI Autopilot
          </button>
        </div>

        {/* Feedback Alert */}
        {feedback.kind !== "idle" && (
          <div
            className={`rounded-xl border p-4 text-sm ${
              feedback.kind === "success"
                ? "border-emerald-400/30 bg-emerald-500/10 text-emerald-100"
                : "border-rose-400/30 bg-rose-500/10 text-rose-100"
            }`}
          >
            <div className="flex flex-col gap-1">
              <div>{feedback.message}</div>
              {feedback.kind === "success" && postUrl && (
                <a
                  href={postUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-cyan-300 hover:text-cyan-200 underline mt-1.5"
                >
                  View published post on LinkedIn ↗
                </a>
              )}
            </div>
          </div>
        )}

        {/* --- Tab 1: Fixed Message --- */}
        {activeTab === "fixed" && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <h3 className="text-base font-semibold text-white font-sans">Compose a fixed message</h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Write your post content, choose to publish it once, or set it to run on recurring schedule slots.
                </p>
              </div>
              <button
                type="button"
                onClick={handleLoadTopics}
                disabled={topicsPending || draftPending}
                className="inline-flex items-center gap-1.5 rounded-lg border border-white/[0.08] bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-zinc-200 transition-colors hover:bg-white/[0.08] disabled:opacity-60"
              >
                {topicsPending ? (
                  <svg className="animate-spin h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                ) : (
                  <svg className="h-3.5 w-3.5 text-violet-400" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M8 1.5l1.5 3.5 3.5 1.5-3.5 1.5L8 11.5 6.5 8 3 6.5 6.5 5 8 1.5z" />
                  </svg>
                )}
                <span>{topicsPending ? "Generating ideas…" : "Suggest topics"}</span>
              </button>
            </div>

            {/* AI Topics suggest panel */}
            {showTopics && (
              <div className="rounded-2xl border border-white/[0.06] bg-zinc-950/40 p-4 space-y-3">
                {topicsError ? (
                  <p className="text-xs text-rose-200">{topicsError}</p>
                ) : (
                  <ul className="grid gap-2 sm:grid-cols-2">
                    {topics.map((t, idx) => (
                      <li key={idx}>
                        <button
                          type="button"
                          onClick={() => handlePickTopic(t)}
                          disabled={draftPending}
                          className="group relative flex w-full flex-col gap-1 rounded-xl border border-white/[0.08] bg-zinc-900/40 p-3 text-left text-xs transition-all hover:border-white/[0.16] hover:bg-zinc-900/70 disabled:opacity-60"
                        >
                          <span className="text-sm font-semibold text-white">{t.title}</span>
                          <span className="text-zinc-400 mt-0.5 line-clamp-1">{t.angle}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
                {draftPending && (
                  <div className="flex items-center gap-2 text-xs text-zinc-400">
                    <svg className="animate-spin h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Generating post preview with AI...</span>
                  </div>
                )}
              </div>
            )}

            <label className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500">
                  Post body
                </span>
                <span className={`font-mono text-[10px] uppercase tracking-[0.2em] ${overLimit ? "text-rose-300" : "text-zinc-500"}`}>
                  {charCount}/{MAX_QUEUE_BODY}
                </span>
              </div>
              <div className="relative">
                <textarea
                  ref={textareaRef}
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder="Share your thoughts or announcements..."
                  rows={8}
                  className="w-full rounded-xl border border-white/[0.08] bg-zinc-950/60 p-4 pr-12 pb-14 text-sm leading-relaxed text-white outline-none focus:border-violet-500 placeholder:text-zinc-600 disabled:opacity-60"
                  disabled={refinePending || busy}
                />
                <div className="absolute bottom-3 right-3 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleRefine}
                    disabled={!body.trim() || refinePending || busy}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-violet-500/30 bg-violet-500/10 px-2.5 py-1.5 text-xs font-semibold text-violet-200 transition-all hover:bg-violet-500/20 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {refinePending ? (
                      <svg className="animate-spin h-3 w-3 text-violet-300" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                    ) : (
                      <svg className="h-3 w-3 text-violet-300" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M8 1.5l1.5 3.5 3.5 1.5-3.5 1.5L8 11.5 6.5 8 3 6.5 6.5 5 8 1.5z" />
                      </svg>
                    )}
                    <span>
                      <span className="hidden sm:inline">Refine with AI for LinkedIn</span>
                      <span className="sm:hidden">Refine with AI</span>
                    </span>
                  </button>
                </div>
              </div>
            </label>

            {/* Posting schedule cadence selector */}
            <div className="space-y-3.5 border-t border-white/[0.04] pt-4">
              <div>
                <span className="block font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500">
                  Posting Schedule Cadence
                </span>
                <div className="mt-2 flex gap-4">
                  <label className="flex items-center gap-2 text-sm text-zinc-300 cursor-pointer">
                    <input
                      type="radio"
                      name="cadence"
                      checked={!isRecurring}
                      onChange={() => setIsRecurring(false)}
                      className="accent-violet-500 h-4 w-4 bg-zinc-900 border-zinc-700"
                    />
                    <span>One-time only</span>
                  </label>
                  <label className="flex items-center gap-2 text-sm text-zinc-300 cursor-pointer">
                    <input
                      type="radio"
                      name="cadence"
                      checked={isRecurring}
                      onChange={() => setIsRecurring(true)}
                      className="accent-violet-500 h-4 w-4 bg-zinc-900 border-zinc-700"
                    />
                    <span>Post Fixed message in scheduled time (Recurring)</span>
                  </label>
                </div>
              </div>

              {!isRecurring ? (
                /* One-time custom Date & Time picker */
                <div className="space-y-1.5 animate-fadeIn">
                  <label className="block font-mono text-[9px] uppercase tracking-wider text-zinc-500">
                    Scheduled Publish Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    value={dateTime}
                    onChange={(e) => setDateTime(e.target.value)}
                    className="rounded-xl border border-white/[0.08] bg-zinc-950 px-4 py-2 text-sm text-white focus:outline-none focus:border-violet-500"
                  />
                </div>
              ) : (
                /* Recurring Day and Time scheduler */
                <div className="space-y-4 rounded-xl border border-white/[0.06] bg-zinc-950/40 p-4 animate-fadeIn">
                  <div className="text-xs font-semibold text-zinc-200">Set weekly recurrence slots</div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {/* Weekdays */}
                    <div>
                      <span className="block font-mono text-[9px] uppercase tracking-wider text-zinc-500">
                        Repeat on Days
                      </span>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {[
                          { value: 0, short: "S", label: "Sunday" },
                          { value: 1, short: "M", label: "Monday" },
                          { value: 2, short: "T", label: "Tuesday" },
                          { value: 3, short: "W", label: "Wednesday" },
                          { value: 4, short: "T", label: "Thursday" },
                          { value: 5, short: "F", label: "Friday" },
                          { value: 6, short: "S", label: "Saturday" }
                        ].map((d) => {
                          const selected = daysOfWeek.includes(d.value);
                          return (
                            <button
                              key={d.value}
                              type="button"
                              onClick={() => toggleRecurringDay(d.value)}
                              className={`rounded-lg border px-2.5 py-1 text-xs font-semibold transition-colors ${
                                selected
                                  ? "border-violet-400/40 bg-violet-500/15 text-violet-100"
                                  : "border-white/[0.08] bg-white/[0.04] text-zinc-300 hover:bg-white/[0.08]"
                              }`}
                            >
                              {d.short}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Times of day list and adder */}
                    <div>
                      <span className="block font-mono text-[9px] uppercase tracking-wider text-zinc-500">
                        Times of Day
                      </span>
                      {timesOfDay.length === 0 ? (
                        <p className="mt-1.5 text-xs text-amber-200/80">
                          Add at least one time slot below.
                        </p>
                      ) : (
                        <ul className="mt-1.5 flex flex-wrap gap-1.5">
                          {timesOfDay.map((t) => (
                            <li key={t}>
                              <span className="inline-flex items-center gap-1 rounded-full border border-violet-400/30 bg-violet-500/10 px-2.5 py-0.5 text-xs text-violet-100">
                                {t}
                                <button
                                  type="button"
                                  onClick={() => removeRecurringTime(t)}
                                  className="-mr-1 rounded-full p-0.5 text-violet-200/70 transition-colors hover:bg-white/10 hover:text-violet-50"
                                  aria-label={`Remove ${t}`}
                                >
                                  <svg className="h-2.5 w-2.5" viewBox="0 0 24 24" fill="none">
                                    <path d="M6 6l12 12M6 18L18 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                  </svg>
                                </button>
                              </span>
                            </li>
                          ))}
                        </ul>
                      )}
                      
                      <div className="mt-2.5 flex items-center gap-2">
                        <input
                          type="time"
                          value={newTimeOfDay}
                          onChange={(e) => setNewTimeOfDay(e.target.value)}
                          className="rounded-lg border border-white/[0.08] bg-zinc-950 px-2.5 py-1 text-xs text-zinc-100 outline-none focus:border-violet-400/40"
                        />
                        <button
                          type="button"
                          onClick={addRecurringTime}
                          className="rounded-lg border border-white/[0.08] bg-white/[0.04] px-2.5 py-1 text-xs font-semibold text-zinc-200 transition-colors hover:bg-white/[0.08]"
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end border-t border-white/[0.06] pt-4 gap-3">
              <button
                type="button"
                onClick={handleScheduleFixed}
                disabled={busy || !body.trim() || overLimit}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-500 via-fuchsia-500 to-cyan-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-500/25 transition-all hover:opacity-95 disabled:opacity-50"
              >
                {actionPending ? "Processing..." : isRecurring ? "Schedule Recurring Post" : "Schedule Standalone Post"}
              </button>
              <button
                type="button"
                onClick={handlePostNow}
                disabled={busy || !body.trim() || overLimit}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 transition-all hover:opacity-95 disabled:opacity-50"
              >
                {postNowPending ? "Posting..." : "Post Now"}
              </button>
            </div>
          </div>
        )}

        {/* --- Tab 2: AI Autopilot --- */}
        {activeTab === "autopilot" && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-semibold text-white">AI Autopilot content slots</h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Draft and queue posts autonomously using your profile interests and custom prompt schedules.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleGenerateTomorrow}
                  disabled={actionPending || schedules.length === 0}
                  className="group relative inline-flex items-center gap-2 overflow-hidden rounded-xl bg-white px-4 py-2 text-xs font-semibold text-zinc-950 transition-all hover:bg-zinc-200 disabled:opacity-50 shadow-md"
                >
                  {actionPending ? "Drafting..." : "Generate & Queue Tomorrow's AI Posts"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const hasCategories = profileCategories.length > 0;
                    const customCount = schedules.filter(
                      (s) => !CONTENT_CATEGORIES.includes(s.topic_name as any)
                    ).length;

                    if (!hasCategories && customCount >= 2) {
                      setShowContactPopup(true);
                      return;
                    }

                    setIsCustomTopic(!hasCategories);
                    const defaultTopic = hasCategories ? profileCategories[0] : "";
                    setNewTopicName(defaultTopic);
                    setNewTopicBrief(hasCategories ? (CATEGORY_DEFAULT_PROMPTS[defaultTopic] ?? "") : "");
                    setNewTopicSlots([{ day: 1, time: "09:00" }]);
                    setIsAddingTopic(true);
                  }}
                  disabled={schedules.length >= 7}
                  className="inline-flex items-center gap-1 rounded-xl border border-violet-400/30 bg-violet-500/10 px-3.5 py-2 text-xs font-semibold text-violet-200 hover:bg-violet-500/20 disabled:opacity-50"
                >
                  <span>+ Add Topic</span>
                </button>
              </div>
            </div>

            {/* Interest Topics configuration directly here */}
            <div className="rounded-xl border border-white/[0.06] bg-zinc-950/20 p-5 space-y-4">
              <div>
                <h4 className="text-sm font-semibold text-white">Autopilot Interest Tuning</h4>
                <p className="text-xs text-zinc-400">
                  Select your content interests below. You can schedule autopilot posts specifically for these selected topics.
                </p>
              </div>

              {/* Conversational Selected Interests Banner */}
              <div className="rounded-xl border border-violet-500/20 bg-violet-500/[0.03] p-4 text-sm text-zinc-300">
                <span className="font-semibold text-white">Your selected Interests are: </span>
                {profileCategories.length > 0 ? (
                  <span className="bg-gradient-to-r from-violet-200 via-fuchsia-200 to-cyan-200 bg-clip-text font-medium text-transparent">
                    {profileCategories.join(", ")}
                  </span>
                ) : (
                  <span className="text-zinc-500 italic">None (select interests below to configure autopilot drafting)</span>
                )}
              </div>
              
              <div className="flex flex-wrap gap-2">
                {CONTENT_CATEGORIES.map((category) => {
                  const isChecked = selectedInterests.includes(category);
                  const hasSchedule = schedules.some((s) => s.topic_name.toLowerCase() === category.toLowerCase());
                  
                  return (
                    <button
                      key={category}
                      type="button"
                      onClick={() => handleToggleInterest(category)}
                      className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-all ${
                        isChecked
                          ? "border-violet-500/50 bg-violet-500/20 text-white"
                          : "border-white/[0.06] bg-white/[0.02] text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04]"
                      }`}
                    >
                      {isChecked && (
                        <svg className="h-3 w-3 text-violet-300" viewBox="0 0 16 16" fill="currentColor">
                          <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z" />
                        </svg>
                      )}
                      <span>{category}</span>
                    </button>
                  );
                })}
              </div>

              {/* Save Interests button (explicit option to save) */}
              {hasUnsavedInterests && (
                <div className="flex justify-end pt-2">
                  <button
                    type="button"
                    onClick={handleSaveInterests}
                    disabled={actionPending}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-violet-500 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-violet-500/25 transition-all hover:bg-violet-600 disabled:opacity-50"
                  >
                    {actionPending ? (
                      <svg className="animate-spin h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                    ) : null}
                    <span>Save Interests</span>
                  </button>
                </div>
              )}
            </div>

            {/* List configured schedules */}
            <div className="space-y-4">
              <div className="text-xs font-mono uppercase tracking-wider text-zinc-500">Active Topic Autopilot Schedules</div>
              {schedules.length === 0 ? (
                <div className="rounded-xl border border-dashed border-white/[0.08] bg-zinc-950/40 p-8 text-center text-sm text-zinc-400">
                  No active interest topics configured. Add a topic above to launch autopilot drafting.
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2">
                  {schedules.map((item) => (
                    <div
                      key={item.id}
                      className="relative overflow-hidden rounded-xl border border-white/[0.06] bg-zinc-950/40 p-4 space-y-3"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-semibold text-white">{item.topic_name}</h4>
                          <p className="text-xs text-zinc-400 mt-0.5 line-clamp-2">
                            {item.prompt_brief}
                          </p>
                        </div>
                        <button
                          onClick={() => handleDeleteTopic(item.id)}
                          className="rounded-lg p-1 text-zinc-500 hover:bg-white/5 hover:text-rose-400 transition-colors"
                          title="Delete topic"
                        >
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>

                      <div className="pt-2 border-t border-white/[0.04]">
                        <span className="block font-mono text-[9px] uppercase tracking-wider text-zinc-500">
                          Schedules slots ({item.slots?.length ?? 0}/4 week)
                        </span>
                        <div className="mt-1 flex flex-wrap gap-1.5">
                          {(item.slots ?? []).map((slot: any, idx: number) => (
                            <span
                              key={idx}
                              className="inline-flex items-center rounded bg-zinc-800 px-2 py-0.5 text-[10px] text-zinc-300"
                            >
                              {DAY_NAMES[slot.day].slice(0, 3)} @ {slot.time}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Always display Unconfigured Saved Interests under proper heading */}
              {(() => {
                const unconfiguredInterests = profileCategories.filter(
                  (cat) => !schedules.some((s) => s.topic_name.toLowerCase() === cat.toLowerCase())
                );
                if (unconfiguredInterests.length > 0) {
                  return (
                    <div className="rounded-xl border border-white/[0.04] bg-zinc-950/20 p-4 space-y-2">
                      <div className="text-[11px] font-mono uppercase tracking-wider text-zinc-500">Unconfigured Saved Interests</div>
                      <div className="flex flex-wrap gap-2">
                        {unconfiguredInterests.map((interest) => (
                          <button
                            key={interest}
                            type="button"
                            onClick={() => handleConfigureInterestAutopilot(interest)}
                            className="inline-flex items-center gap-1 rounded-lg border border-cyan-500/20 bg-cyan-500/5 px-2.5 py-1 text-xs font-semibold text-cyan-300 hover:bg-cyan-500/15 transition-all"
                          >
                            <span>⚡ Setup Autopilot for {interest}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                }
                return null;
              })()}
            </div>

            {/* Overboard limit alerts */}
            {schedules.length >= 7 && (
              <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-3 text-xs text-rose-300">
                You have reached your limit of 7 autopilot topics. Please delete an interest topic if you want to add a new one.
              </div>
            )}

            {/* Add topic form overlay */}
            {isAddingTopic && (
              <div className="rounded-xl border border-white/[0.08] bg-zinc-950 p-4 space-y-4 transition-all">
                <div className="flex items-center justify-between border-b border-white/[0.06] pb-2">
                  <h4 className="text-sm font-semibold text-white">Configure Autopilot Topic</h4>
                  <button
                    onClick={() => {
                      setIsAddingTopic(false);
                      setNewTopicName("");
                      setNewTopicBrief("");
                      setNewTopicSlots([]);
                    }}
                    className="text-zinc-500 hover:text-white text-xs"
                  >
                    Close
                  </button>
                </div>

                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="block text-xs font-mono uppercase tracking-wider text-zinc-500">
                      Topic / Interest Category
                    </label>

                    {profileCategories.length > 0 ? (
                      /* Dropdown choice for selecting saved interest topics */
                      <select
                        value={isCustomTopic ? "custom" : newTopicName}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (val === "custom") {
                            const customCount = schedules.filter(
                              (s) => !CONTENT_CATEGORIES.includes(s.topic_name as any)
                            ).length;
                            if (customCount >= 2) {
                              setShowContactPopup(true);
                              return;
                            }
                            setIsCustomTopic(true);
                            setNewTopicName("");
                            setNewTopicBrief("");
                          } else {
                            setIsCustomTopic(false);
                            setNewTopicName(val);
                            setNewTopicBrief(CATEGORY_DEFAULT_PROMPTS[val] ?? "");
                          }
                        }}
                        className="w-full rounded-xl border border-white/[0.08] bg-zinc-900 px-3 py-2 text-sm text-white focus:outline-none focus:border-violet-500"
                      >
                        <option value="">-- Choose from your Saved Interests --</option>
                        {profileCategories.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                        <option value="custom">-- Configure Custom Topic name... --</option>
                      </select>
                    ) : (
                      <p className="text-xs text-zinc-400 italic">
                        No interests saved in creator profile. Please toggle and save interests above first to use the dropdown list.
                      </p>
                    )}
                  </div>

                  {(isCustomTopic || profileCategories.length === 0) && (
                    <div className="space-y-1 animate-fadeIn">
                      <label className="block text-xs font-mono uppercase tracking-wider text-zinc-500">
                        Custom Topic Name
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Generative AI"
                        value={newTopicName}
                        onChange={(e) => setNewTopicName(e.target.value)}
                        className="w-full rounded-xl border border-white/[0.08] bg-zinc-900 px-3 py-2 text-sm text-white focus:outline-none focus:border-violet-500"
                      />
                      <p className="text-[11px] text-amber-300/80 mt-1">ℹ️ You can configure a maximum of 2 custom interest topics.</p>
                    </div>
                  )}

                  <div className="space-y-1">
                    <label className="block text-xs font-mono uppercase tracking-wider text-zinc-500">
                      Prompt brief / Style Instructions
                    </label>
                    <textarea
                      placeholder="Tell AI what to cover and how to structure this topic..."
                      rows={3}
                      value={newTopicBrief}
                      onChange={(e) => setNewTopicBrief(e.target.value)}
                      className="w-full rounded-xl border border-white/[0.08] bg-zinc-900 p-3 text-sm text-white focus:outline-none focus:border-violet-500"
                    />
                  </div>

                  {/* Slot planner */}
                  <div className="pt-2 border-t border-white/[0.04] space-y-2">
                    <label className="block text-xs font-mono uppercase tracking-wider text-zinc-500">
                      Configure Schedule Slots (Max 4 per week)
                    </label>

                    <div className="flex gap-2">
                      <select
                        value={slotDay}
                        onChange={(e) => setSlotDay(Number(e.target.value))}
                        className="rounded-xl border border-white/[0.08] bg-zinc-900 px-3 py-2 text-xs text-white"
                      >
                        {DAY_NAMES.map((name, i) => (
                          <option key={i} value={i}>
                            {name}
                          </option>
                        ))}
                      </select>
                      <input
                        type="time"
                        value={slotTime}
                        onChange={(e) => setSlotTime(e.target.value)}
                        className="rounded-xl border border-white/[0.08] bg-zinc-900 px-3 py-2 text-xs text-white"
                      />
                      <button
                        type="button"
                        onClick={handleAddSlotToTopic}
                        disabled={newTopicSlots.length >= 4}
                        className="rounded-xl bg-zinc-800 border border-zinc-700 px-3 py-2 text-xs font-medium text-zinc-300 hover:text-white disabled:opacity-50"
                      >
                        Add Slot
                      </button>
                    </div>

                    {/* Temporary Slots List */}
                    {newTopicSlots.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {newTopicSlots.map((slot, i) => (
                          <span
                            key={i}
                            className="inline-flex items-center gap-1 rounded bg-zinc-850 px-2 py-0.5 text-xs text-zinc-300 border border-zinc-800"
                          >
                            <span>
                              {DAY_NAMES[slot.day]} @ {slot.time}
                            </span>
                            <button
                              onClick={() => handleRemoveSlotFromTopic(i)}
                              className="text-zinc-500 hover:text-rose-400 font-bold"
                            >
                              &times;
                            </button>
                          </span>
                        ))}
                      </div>
                    )}

                    {newTopicSlots.length >= 4 && (
                      <div className="text-[11px] text-rose-400">
                        You have reached the maximum limit of 4 slots per week for this topic.
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-white/[0.04]">
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddingTopic(false);
                      setNewTopicName("");
                      setNewTopicBrief("");
                      setNewTopicSlots([]);
                    }}
                    className="rounded-xl bg-zinc-800 border border-zinc-700 px-4 py-2 text-xs font-semibold text-zinc-300 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveTopic}
                    className="rounded-xl bg-gradient-to-r from-violet-500 via-fuchsia-500 to-cyan-500 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-violet-500/25 transition-all hover:opacity-95"
                  >
                    Save Topic
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Support limit notification modal */}
      {showContactPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-white/[0.06] bg-zinc-900 p-6 shadow-2xl">
            {/* Glow effect */}
            <div aria-hidden className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-violet-500/10 blur-2xl" />
            
            <div className="relative flex flex-col items-center text-center space-y-4">
              {/* Alert icon */}
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              
              <div className="space-y-1.5">
                <h3 className="text-lg font-bold text-white">Custom Interest Limit Reached</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  You can configure a maximum of 2 custom interest topics under the standard plan. To add more custom autopilot schedules, please contact support.
                </p>
              </div>

              <div className="flex w-full flex-col gap-2 pt-2">
                <Link
                  href="/app/contact"
                  className="flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-violet-500 via-fuchsia-500 to-cyan-500 py-2.5 text-xs font-semibold text-white shadow-lg transition-all hover:opacity-95"
                >
                  Contact Support
                </Link>
                <button
                  type="button"
                  onClick={() => setShowContactPopup(false)}
                  className="flex w-full items-center justify-center rounded-xl bg-zinc-800 border border-zinc-700 py-2.5 text-xs font-semibold text-zinc-300 transition-all hover:text-white"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
