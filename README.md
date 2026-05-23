# SocialBoost — AI LinkedIn Growth on Autopilot

SocialBoost is a full-stack Next.js application that helps creators grow their LinkedIn audience on autopilot. It uses AI to suggest high-performing post topics, drafts them in your personal voice, schedules them at optimal engagement times, and automatically publishes them directly to your LinkedIn feed.

---

## 🚀 Key Features

* **AI Studio (Drafting):** Enter a rough thought or detail and let our GPT-5.4-powered content engine generate ready-to-publish LinkedIn drafts.
* **Autopilot (Scheduling) Engine:** Define your core interests and configure automated scheduled slots. SocialBoost will draft and queue posts autonomously.
* **"Refine with AI for LinkedIn" Tool:** A smart, in-composer assistant that refines draft text, fixes spelling and grammar, adds structure for readability, and appends 3–5 relevant hashtags.
* **LinkedIn Spotlight Templates:** Hand-picked, high-engagement presets like #OpenToWork announcements, "We're Hiring" notices, AI trends, and leadership posts.
* **Support Contact Page:** Integrated support routes for saswatpatro via Email, Call, or WhatsApp, triggered automatically when hitting the custom interest limits.
* **Dynamic Analytics Dashboard:** Tracks actual published post counts and displays simulated growth metrics (Followers Gained, 7d Engagement) dynamically when LinkedIn is linked.

---

## 🛠️ Getting Started

### Prerequisites

* Node.js (v18.x or later)
* npm (installed with Node)

### Installation

1. Clone or download the repository to your local directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy the sample environment file:
   ```bash
   cp .env.example .env.local
   ```
4. Fill in the required credentials in `.env.local` (see Environment Variables below).
5. Start the development server:
   ```bash
   npm run dev
   ```
6. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## ⚙️ Environment Variables

Copy `.env.example` to `.env.local` and configure the following:

* `NEXT_PUBLIC_INSFORGE_URL` — Your InsForge backend URL (`https://<app>.<region>.insforge.app`).
* `INSFORGE_ANON_KEY` — InsForge anonymous access key.
* `NEXT_PUBLIC_APP_URL` — Base URL of your app (e.g., `http://localhost:3000` locally, or your production domain).
* `LINKEDIN_CLIENT_ID` / `LINKEDIN_CLIENT_SECRET` — Credentials from your LinkedIn Developer portal. Ensure **Sign In with LinkedIn using OpenID Connect** and **Share on LinkedIn** products are enabled, and register the callback redirect:
  `${NEXT_PUBLIC_APP_URL}/api/linkedin/callback`

---

## 🗄️ Database & Edge Functions

SocialBoost relies on an InsForge backend for database hosting (PostgreSQL) and the background scheduling worker (Deno Edge Function).

### 1. Database Migrations
Migrations are stored in `/migrations` and can be applied using the InsForge CLI:
```bash
npx @insforge/cli db migrations up --all
```

### 2. Deploy Scheduler Tick Function
The autopilot publishing tick is handled by a Deno edge function in `/insforge/functions/scheduler-tick`.
1. Set the necessary scheduler secrets on InsForge.
2. Deploy the function:
   ```bash
   npx @insforge/cli functions deploy scheduler-tick
   ```
3. Create the 1-minute schedule cron inside the InsForge console to trigger the function.

---

## 📦 How to Publish to GitHub

To store your project code securely and collaborate on GitHub:

1. **Initialize Git Repository:**
   If git isn't initialized yet, run:
   ```bash
   git init
   ```
2. **Add Files to Staging:**
   ```bash
   git add .
   ```
   *(Ensure sensitive files like `.env.local` or `node_modules` are excluded in `.gitignore`)*
3. **Commit the Code:**
   ```bash
   git commit -m "Initial commit: SocialBoost LinkedIn growth engine"
   ```
4. **Create a Repository on GitHub:**
   * Go to [github.com](https://github.com) and click **New Repository**.
   * Name your repository `SocialBoost` (or preferred name).
   * Leave "Initialize this repository with..." options unchecked.
5. **Link and Push to GitHub:**
   Copy the commands from GitHub and run them:
   ```bash
   git remote add origin https://github.com/<your-username>/SocialBoost.git
   git branch -M main
   git push -u origin main
   ```

---

## 🌐 How to Host the Project

Since SocialBoost is a dynamic Next.js application using Server Actions, cookies, and database connectivity, it **cannot** be hosted on static platforms like GitHub Pages (which only serve static assets like `index.html`). It requires a Node.js-compatible serverless hosting platform.

### Recommended: Hosting on Vercel (Easiest)

Vercel is the creators of Next.js and provides first-class support for Server Actions, dynamic rendering, and redirects.

1. **Sign Up/In to Vercel:**
   Go to [vercel.com](https://vercel.com) and link your GitHub account.
2. **Import Repository:**
   * Click **Add New** -> **Project**.
   * Import your `SocialBoost` repository from the GitHub list.
3. **Configure Environment Variables:**
   Under **Environment Variables** in the Vercel deploy screen, copy-paste the variables from your `.env.local`:
   * `NEXT_PUBLIC_INSFORGE_URL`
   * `INSFORGE_ANON_KEY`
   * `NEXT_PUBLIC_APP_URL` (Set this to your Vercel deployment URL, e.g. `https://social-boost.vercel.app`)
   * `LINKEDIN_CLIENT_ID`
   * `LINKEDIN_CLIENT_SECRET`
4. **Update LinkedIn Developer Portal Redirect URI:**
   Once Vercel gives you your production domain, go to your LinkedIn developer app settings and register the production redirect URI:
   `https://<your-vercel-domain>.vercel.app/api/linkedin/callback`
5. **Deploy:**
   Click **Deploy**. Vercel will automatically build and publish your Next.js application, providing you with a live HTTPS URL.

### Alternative: Firebase App Hosting

If you want to keep your project fully integrated with Google Cloud/Firebase:
1. Initialize Firebase App Hosting in your directory:
   ```bash
   npx -y firebase-tools@latest apphosting:discover
   ```
2. Follow the prompt to connect your GitHub repo and configure the Next.js runtime environment.
