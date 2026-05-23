export type SampleTopic = {
  title: string;
  format:
    | "story"
    | "tactical-list"
    | "contrarian-take"
    | "case-study"
    | "framework"
    | "data-drop";
  category: string;
  hook: string;
  angle: string;
};

export const SAMPLE_TOPICS: SampleTopic[] = [
  {
    title: "Why I stopped saying \u201cI\u2019m too busy\u201d \u2014 and what I say instead",
    format: "story",
    category: "Leadership",
    hook: "I used to wear \u2018busy\u2019 like a badge. Then a peer asked: \u2018Busy with what, exactly?\u2019 I had no answer.",
    angle:
      "Reframing busyness as a choice forced me to look at my actual priorities, and made me a better leader.",
  },
  {
    title: "The 5 questions I ask before saying yes to any meeting",
    format: "tactical-list",
    category: "Productivity",
    hook: "My calendar used to look like Tetris. These five questions cleared 12 hours a week.",
    angle:
      "Most meetings are theater. A simple intake filter forces calendar discipline without becoming the office grump.",
  },
  {
    title: "Your team\u2019s velocity isn\u2019t a productivity metric. It\u2019s a vibe check.",
    format: "contrarian-take",
    category: "Engineering",
    hook: "If your team\u2019s velocity is going up every sprint, something is being faked.",
    angle:
      "Velocity rewards inflation. The fix isn\u2019t a better number \u2014 it\u2019s a different conversation.",
  },
  {
    title: "How a 30-minute Loom replaced our weekly product review",
    format: "case-study",
    category: "Product",
    hook: "We had five recurring product reviews on the calendar. Five. I cancelled them all last quarter.",
    angle:
      "Async-first updates + a decision doc cut meeting load 40% and shipped two extra features per quarter.",
  },
  {
    title: "The 1-3-5 framework I use to plan every quarter",
    format: "framework",
    category: "Strategy",
    hook: "1 big bet. 3 needle-movers. 5 maintenance items. That\u2019s the whole quarter.",
    angle:
      "A simple ratio that prevents over-commitment and forces honest trade-offs in your planning doc.",
  },
  {
    title: "We A/B tested 100 LinkedIn hooks. Here\u2019s what we learned.",
    format: "data-drop",
    category: "Marketing",
    hook: "Hook #1: \u201cI did X for 30 days.\u201d Hook #2: \u201cHot take: X is dead.\u201d Only one of these still works in 2026.",
    angle:
      "Pattern-based hooks have a half-life. Specificity beats template every time.",
  },
  {
    title: "Why we killed our company values poster (and what replaced it)",
    format: "story",
    category: "Culture",
    hook: "Our values were on the wall. Nobody could quote them under pressure. So we changed the test.",
    angle:
      "Values are stories you tell, not nouns you frame. Here\u2019s the one ritual that made ours real.",
  },
  {
    title: "The unsexy reason your senior hires keep leaving in year 2",
    format: "contrarian-take",
    category: "Hiring",
    hook: "It\u2019s not comp. It\u2019s not the manager. It\u2019s the thing nobody puts on a job ladder.",
    angle:
      "Senior ICs need a clear next move within 18 months or they ghost. Most companies invent it too late.",
  },
  {
    title: "I shipped my first AI feature in 3 days. Here\u2019s the playbook.",
    format: "case-study",
    category: "AI",
    hook: "Day 1: prompt. Day 2: eval set. Day 3: shipping behind a flag. No fine-tuning, no agents.",
    angle:
      "An honest, no-hype log of how a small team got an AI feature in front of real users in under a week.",
  },
  {
    title: "5 things I changed about my standup that actually helped",
    format: "tactical-list",
    category: "Engineering",
    hook: "Standups got useful the moment we banned the word \u2018status\u2019.",
    angle:
      "Five small changes \u2014 each tested, each measured \u2014 that turned standup from a tax into a lever.",
  },
  {
    title: "The hiring funnel math nobody wants to look at",
    format: "data-drop",
    category: "Hiring",
    hook: "We need 1 hire. So we screen 60. So we sit through 18 interviews. Why?",
    angle:
      "Plotting the funnel honestly reveals where time leaks \u2014 and which step is doing 80% of the screening.",
  },
  {
    title: "My job is not to make my team happy. It\u2019s to make them dangerous.",
    format: "contrarian-take",
    category: "Leadership",
    hook: "Happy teams don\u2019t move mountains. Dangerous teams do.",
    angle:
      "What \u2018dangerous\u2019 means: deeply skilled, deeply trusted, allergic to permission slips.",
  },
  {
    title: "The one slide I add to every executive deck that lands the budget",
    format: "framework",
    category: "Strategy",
    hook: "Slide 7. Always slide 7. Never first, never last.",
    angle:
      "A repeatable structure for the slide that quietly does the persuading while the others do the explaining.",
  },
  {
    title: "How we onboarded a new engineer in 5 days (and what year-old onboarding gets wrong)",
    format: "case-study",
    category: "Engineering",
    hook: "Day 5, she shipped to production. Day 6, she was reviewing PRs.",
    angle:
      "An onboarding plan that swaps reading docs for shipping a tiny, real feature on day one.",
  },
  {
    title: "The 4-quadrant model I use to triage incoming ideas",
    format: "framework",
    category: "Product",
    hook: "Two axes, four boxes, zero arguments. Every idea gets one square.",
    angle:
      "A simple visual that ends \u2018everything is important\u2019 conversations in 90 seconds.",
  },
  {
    title: "I asked 50 founders about their biggest hiring regret. Same answer.",
    format: "data-drop",
    category: "Hiring",
    hook: "It wasn\u2019t the bad hire. It was how long they took to make the obvious call.",
    angle:
      "Founders consistently underestimate the cost of waiting. Here\u2019s the math + the courage tax.",
  },
  {
    title: "Why your roadmap should fit on one screen \u2014 always",
    format: "tactical-list",
    category: "Product",
    hook: "If you can\u2019t see the next 90 days without scrolling, your team can\u2019t either.",
    angle:
      "Five constraints that turn a wall-of-text Notion doc into a roadmap your team actually opens.",
  },
  {
    title: "The note I write to myself at the end of every quarter",
    format: "story",
    category: "Personal growth",
    hook: "It\u2019s 4 questions, takes 20 minutes, and it has rebuilt my career twice.",
    angle:
      "A quarterly retro template for individuals \u2014 separate from your performance review \u2014 that compounds over time.",
  },
  {
    title: "What \u2018world-class\u2019 actually means at the engineering manager level",
    format: "contrarian-take",
    category: "Engineering",
    hook: "It\u2019s not 1:1s. It\u2019s not the standup. It\u2019s the boring thing nobody puts on a JD.",
    angle:
      "Most EM rubrics measure outputs. The world-class ones consistently change the system around their team.",
  },
  {
    title: "5 prompts that 10x my LinkedIn posts (and 1 that ruined them for a month)",
    format: "tactical-list",
    category: "AI",
    hook: "I copied an influencer\u2019s prompt for 30 days. My engagement halved.",
    angle:
      "Practical AI-writing prompts \u2014 plus a cautionary tale about template-pilling your voice.",
  },
  {
    title: "We deleted half our metrics. Decisions got faster.",
    format: "case-study",
    category: "Data",
    hook: "Our weekly review used to be 22 charts. Now it\u2019s 6. Same business, sharper questions.",
    angle:
      "How to audit your dashboard like a museum curator: every metric must justify its frame.",
  },
  {
    title: "The compounding bet most career advice forgets to mention",
    format: "story",
    category: "Career",
    hook: "I almost didn\u2019t take the role. Three years later it\u2019s the only line on my resume that matters.",
    angle:
      "A personal story about the compounding effects of writing in public, every week, even when nobody reads.",
  },
  {
    title: "Why your design system isn\u2019t adopted (and the 3-week fix)",
    format: "tactical-list",
    category: "Design",
    hook: "We rebuilt our DS three times. The 4th time, adoption hit 92% in a month. Different playbook.",
    angle:
      "Three structural changes \u2014 not new components \u2014 that flipped adoption from \u2018meh\u2019 to default.",
  },
  {
    title: "The pricing change that doubled our ACV (and the one we reverted in a week)",
    format: "data-drop",
    category: "Pricing",
    hook: "One price test made us 2x the money. Another tanked our trial-to-paid 30%. Both took the same hour to ship.",
    angle:
      "Two real pricing experiments, side by side, with the math, the screenshots, and what we’d do differently.",
  },
];

export const SPOTLIGHT_TEMPLATES: SampleTopic[] = [
  {
    title: "Why I'm wearing the green #OpenToWork banner (and the shifts I'm looking for)",
    format: "story",
    category: "Career",
    hook: "I used to think the green banner was a sign of desperation. Now, I see it as a sign of transition and readiness.",
    angle: "Looking for my next challenge in engineering management. Let's talk about building high-agency teams.",
  },
  {
    title: "We're hiring a founding software engineer to build the future of AI automation",
    format: "story",
    category: "Hiring",
    hook: "We're not looking for resources. We're looking for partners who are allergic to red tape and ready to ship.",
    angle: "Details on our tech stack, salary, and why this is the hardest (and most rewarding) role you'll take.",
  },
  {
    title: "The hidden cost of wrapper startups in the age of LLM commoditization",
    format: "contrarian-take",
    category: "AI",
    hook: "If your AI startup can be cloned by a 5-line prompt change in ChatGPT, you don't have a moat.",
    angle: "Moats are built in the proprietary data integration and user workflow, not the raw api call.",
  },
  {
    title: "How we fine-tuned our customer support model for 95% accuracy",
    format: "case-study",
    category: "AI",
    hook: "We replaced our generic chat assistant with a custom LLM fine-tune. Support tickets dropped 60%.",
    angle: "Step-by-step breakdown of dataset prep, prompt evals, and fine-tuning costs.",
  },
  {
    title: "How public policy changes in tech regulation will impact startups in 2026",
    format: "framework",
    category: "Policy",
    hook: "The new tech regulation bills aren't just for big tech. They are going to squeeze early-stage startups.",
    angle: "A non-partisan analysis of compliance requirements and how to prepare your codebase early.",
  },
  {
    title: "Navigating the 2026 tech layoffs and the rise of fractional roles",
    format: "contrarian-take",
    category: "Trends",
    hook: "Full-time jobs are becoming a luxury. Fractional roles are the new normal in tech.",
    angle: "How developers and PMs can hedge their career risk by holding multiple fractional client advisory roles.",
  },
  {
    title: "Why building in public is the only marketing channel that matters in 2026",
    format: "story",
    category: "Marketing",
    hook: "I shared my raw database migration failure on LinkedIn. It brought us 14 customer signups.",
    angle: "Authenticity and vulnerability beat polished ad copy every single time.",
  },
  {
    title: "The return to office (RTO) mandates are a management trust issue",
    format: "contrarian-take",
    category: "Leadership",
    hook: "If you need your developers in their chairs to know they are working, you are measuring the wrong things.",
    angle: "RTO mandates are proxy metrics for micro-managers. Focus on outputs, not keycard badge-in logs.",
  }
];

// Append spotlight templates to general topics
SAMPLE_TOPICS.push(...SPOTLIGHT_TEMPLATES);


export function pickTopics(seed: number, count = 6): SampleTopic[] {
  const indexes = SAMPLE_TOPICS.map((_, i) => i);
  const rng = mulberry32(seed);
  for (let i = indexes.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [indexes[i], indexes[j]] = [indexes[j], indexes[i]];
  }
  return indexes.slice(0, count).map((i) => SAMPLE_TOPICS[i]);
}

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
