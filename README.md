<p align="center">
  <img src="./public/icon.svg" alt="Lean In Connect" width="92" height="92" />
</p>

<h1 align="center">Lean In Connect</h1>

<p align="center">
  <strong>A full-stack community platform helping women grow their careers together.</strong>
</p>

<p align="center">
  Design Engineer take-home assessment for the<br />
  Sandberg Goldberg Bernthal Family Foundation.
</p>

<p align="center">
  <a href="https://leanin-connect.vercel.app/feed"><strong>View live app</strong></a>
  ·
  <a href="https://github.com/iamhtk/leanin-connect">GitHub</a>
  ·
  Built by <a href="https://github.com/iamhtk">Hrithik Sanyal</a>
</p>

<p align="center">
  <img alt="Next.js" src="https://img.shields.io/badge/Next.js-14-000000?style=flat-square&logo=nextdotjs" />
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-strict-3178C6?style=flat-square&logo=typescript&logoColor=white" />
  <img alt="Supabase" src="https://img.shields.io/badge/Supabase-Realtime-3FCF8E?style=flat-square&logo=supabase&logoColor=white" />
  <img alt="Anthropic" src="https://img.shields.io/badge/AI-Claude-D97757?style=flat-square&logo=anthropic&logoColor=white" />
  <img alt="Vercel" src="https://img.shields.io/badge/Deployed-Vercel-000000?style=flat-square&logo=vercel" />
</p>

---

## ✨ At a Glance

- **15 product pages** across community, career, messaging, and account experiences
- **11 AI features** powered by Claude, including streaming and multi-agent workflows
- **Realtime collaboration** through live notifications and Circle messages
- **Production-minded frontend** with optimistic UI, cursor pagination, PWA support, and WCAG 2.1 AA

## 🧭 Contents

- [Stack](#-stack)
- [What Is Real vs Mocked](#-what-is-real-vs-mocked)
- [Pages](#-pages-15)
- [Authentication](#-authentication)
- [Backend Engineering](#-backend-engineering)
- [AI Features](#-ai-features-11)
- [Frontend Engineering](#-frontend-engineering)
- [Design System Architecture](#-design-system-architecture)
- [Running Locally](#-running-locally)

---

## 🧰 Stack

`Next.js 14` · `TypeScript` · `Tailwind CSS v4` · `Supabase` ·
`Anthropic Claude` · `Framer Motion` · `Tiptap` · `shadcn/ui` · `Vercel`

> Supabase powers authentication, PostgreSQL, Storage, and Realtime. Claude powers every AI workflow through server-only API routes.

---

## ✅ What Is Real vs Mocked

> **Real**
> Supabase Auth; posts, likes, notifications, Circle messages, and profiles; avatar uploads; all Anthropic calls; Row Level Security; database triggers; and Realtime subscriptions.

> **Mocked**
> Job listings, conversations, member directory, Circles, Networks, Groups, Events, and Resources. Mock data remains typed and centralized in `src/data/`.

---

## 🗺️ Pages (15)

`Feed` · `Jobs` · `Messages` · `Circles` · `Circle Detail` · `Networks` ·
`Groups` · `Directory` · `Events` · `Resources` · `Resource Detail` ·
`Notifications` · `Profile` · `Settings` · `Auth`

Dynamic routes: `/circles/[id]` and `/resources/[id]`

---

## 🔐 Authentication

Email and password sign up and sign in via Supabase Auth.
A Next.js middleware protects all 13 app routes — unauthenticated
requests redirect to /auth/login with the original path preserved
as a redirectTo query parameter. On signup, a Postgres trigger
fires automatically to create a matching profile row, deriving
initials from the user's full name without any client-side code.

---

## 🗄️ Backend Engineering

### 🛡️ Row Level Security

Every table has RLS enabled with explicit policies:

- **`posts`** — Public reads; authenticated inserts; owner-only updates and deletes
- **`likes`** — Public reads; authenticated, user-scoped inserts and deletes
- **`profiles`** — Public reads; user-scoped inserts and updates
- **`notifications`** — Every operation is scoped to the recipient
- **`circle_messages`** — Public reads; authenticated inserts
- **`storage.objects`** — Public avatar reads; authenticated writes scoped to the user's UUID

### ⚙️ Database Triggers and Functions

**`handle_new_user`** — Fires on `INSERT` to `auth.users`. Reads
raw_user_meta_data.full_name, generates initials, and inserts
into public.profiles. Profile creation is never client-side.

**`update_post_likes_count`** — Fires on `INSERT` and `DELETE` to the likes
table. Atomically increments or decrements likes_count on the
corresponding post row. The client never writes to likes_count
directly.

**`create_like_notification`** — Fires on `INSERT` to likes. Looks up the
post author and the liker's profile. If the liker is not the
post author, inserts a notification row for the author. All
notification creation is handled at the database layer.

### ⚡ Supabase Realtime

Two tables are published to the Realtime channel:
notifications and circle_messages.

The useRealtimeNotifications hook subscribes to
notifications filtered by user_id. When the like trigger creates
a notification, it appears in the recipient's browser
immediately with no polling.

The useCircleMessages hook subscribes to circle_messages
filtered by circle_id. Messages posted by any member appear
for all circle viewers instantly.

### 📦 Supabase Storage

A public "avatars" bucket stores profile photos at the path
{userId}/avatar.{ext}. The API route validates file type
(JPEG, PNG, WebP, GIF) and size (5MB max) server-side, uploads
with upsert so re-uploads replace the previous file, and updates
the profiles table with the cache-busted public URL.

### ♾️ Cursor-based Pagination

The GET /api/posts endpoint accepts cursor (an ISO timestamp)
and limit (default 10). It fetches limit + 1 rows older than
the cursor using a less-than filter on created_at, uses the
extra result to determine hasMore, and returns nextCursor
pointing to the last post's timestamp. An IntersectionObserver
in useInfiniteScroll fires the next fetch when the sentinel
div enters the viewport.

### 🔌 API Routes (13)

- **`/api/posts`** — Cursor-paginated reads and authenticated writes
- **`/api/profile-photo`** — Multipart validation and Storage upload
- **`/api/ai/career-pulse`** — Three-agent sequential Claude chain
- **`/api/ai/voice-coach`** — Streaming post-draft generation
- **`/api/ai/job-match`** — Profile-to-listing matching
- **`/api/ai/salary-coach`** — Role-specific negotiation guidance
- **`/api/ai/conversation-starter`** — Personalized openers
- **`/api/ai/chat-reply`** — Conversation-aware replies
- **`/api/ai/circle-recommend`** — Profile-to-Circle matching
- **`/api/ai/profile-strength`** — Profile completeness analysis
- **`/api/ai/search`** — Semantic platform search
- **`/api/ai/classify-topic`** — Single-call topic classification
- **`/api/ai/assistant`** — Platform assistant with session history

---

## 🤖 AI Features (11)

### AI Career Pulse · Agentic
Three sequential Claude calls on feed load. Agent 1 identifies
the dominant career theme from current post tags. Agent 2
matches that theme to a real Lean In Women in the Workplace
research statistic. Agent 3 synthesizes an insight paragraph and
three discussion questions. Each agent's output feeds the next.
Clicking a question opens the post composer pre-filled with it.

### AI Voice Coach · Streaming
Transforms rough notes into a polished community post using
the Anthropic streaming API. The response streams character by
character into the Tiptap editor. After the stream completes,
a second call to /api/ai/classify-topic auto-selects the most
relevant topic tag with a visual pulse animation.

### AI Job Match
On Jobs page load, Claude evaluates all listings against the
user profile and surfaces the top two matches with a specific
one-sentence reason. Matched cards receive an AI Match badge.

### AI Salary Coach
Clicking Apply opens a modal that immediately fetches three
negotiation tips specific to the exact role, company, and
salary range. Tips arrive while the user reads the loading
state. Includes a direct Apply link and a dismiss option.

### AI Conversation Starter
Generates three personalized conversation openers based on the
recipient's name, role, and company. One click pre-fills the
message input. Available in every conversation thread.

### AI Chat Replies
Every sent message triggers a Claude reply role-playing as the
conversation participant with full conversation history context.
A typing indicator appears for 1.5 seconds before the reply
renders to simulate natural timing.

### AI Circle Recommender
On Circles page load, Claude matches the user profile against
all available circles and returns the top three recommendations
with a specific reason per circle. Displayed as a horizontally
scrollable section with a brand left-border treatment.

### AI Profile Strength Coach
Analyzes profile completeness on the Profile page and returns
a 0-100 score with three improvement suggestions each including
a measurable impact statement. The score animates in via a
progress bar on load.

### AI Smart Search
The topbar search sends queries to Claude on Enter. Claude
searches across circles, members, resources, and topics,
returns categorized results with a one-sentence summary, and
provides direct navigation links per result.

### AI Key Takeaways
On every resource detail page, a sparkles button sends the
article content to Claude and streams back three bullet-point
takeaways formatted for sharing with a Circle.

### AI Assistant
A persistent right-side panel opened via the Sparkles icon in
the topbar. Full conversation history is maintained per session.
Claude has platform context and answers navigation and community
questions.

---

## 🎨 Frontend Engineering

### 🧩 Design System
Three-tier token architecture in src/tokens/:
primitives.ts holds raw values with no semantic meaning.
semantic.ts maps purpose-named tokens that reference
primitives only and defines light and dark mode values.
mapped.ts holds component-context tokens that reference
semantic only. Zero hardcoded color, spacing, or radius values
exist in any component file.

### 🌙 Dark Mode
A ThemeContext wraps the app and writes a data-theme attribute
to the document root. CSS custom properties in globals.css
define a complete [data-theme="dark"] token override set.
An inline script in the document head reads localStorage and
sets data-theme before React hydrates, preventing the white
flash entirely. The user's preference persists across sessions.

### ⌨️ CMD+K Command Palette
Full keyboard-accessible command palette with 20 commands
across five groups: Navigation, Actions, Topics, Account, and
a real-time filtered view. Arrow keys navigate, Enter selects,
Escape closes. The active item scrolls into view automatically.
A KBD hint is visible in the topbar search bar.

### 🚀 Optimistic UI
Post likes update instantly in the UI before the Supabase
INSERT resolves. On server error, the count reverts to its
previous value. Bookmarks write synchronously to localStorage
and update state immediately. Both patterns eliminate perceived
latency.

### ✍️ Tiptap Rich Text Editor
The post composer uses Tiptap with StarterKit, Placeholder,
and CharacterCount extensions. The toolbar supports bold,
italic, bullet lists, numbered lists, and horizontal rules.
A character counter turns amber at 80% and red at the 500
character limit. Posted HTML renders safely in the feed via a
sanitize function that strips scripts and event attributes.

### 🎬 Framer Motion
Page transitions use AnimatePresence with a 180ms ease-out
enter and 120ms ease-in exit. The sidebar active indicator
uses layoutId so the active pill slides between nav items with
a spring animation. Post cards animate in on load. The command
palette scales in from 96% with a custom cubic bezier. The
notification badge scales in with a spring on first appearance.

### 📱 Progressive Web App
A manifest.json registers the app as installable with a name,
short name, start URL at /feed, standalone display, theme color,
and three home screen shortcuts for Feed, Messages, and Jobs.
The app is installable from Chrome on Android, iOS Safari, and
desktop Chrome.

### 📐 Responsive Design
Four token scales defined as CSS custom properties:
Mobile (default, 0-767px), Tablet (768px), Desktop (1024px),
Large (1440px). Mobile shows a bottom tab bar with five items
and hides the desktop sidebar. The messages layout switches to
full-screen conversation view on mobile. Post grids collapse to
single column. Touch targets are 44px minimum throughout.

### ♿ WCAG 2.1 AA
All interactive elements have visible focus indicators (2px
brand color, 2px offset). Every page has a main landmark with
aria-label. All buttons, tabs, and form controls have aria-label
or visible labels. Topic filters use role="tablist" and
aria-selected. The like button announces count to screen readers.
A skip-to-content link is the first focusable element. Reduced
motion is respected via prefers-reduced-motion.

---

## 🏗️ Design System Architecture

```text
src/
├── app/                    # Pages, layouts, and API routes
├── components/
│   ├── atoms/              # Avatar, Tag, FadeIn
│   ├── molecules/          # Cards, filters, editors
│   └── organisms/          # Navigation, feed, composer, assistant
├── contexts/               # AuthContext, ThemeContext
├── data/                   # Typed mock data
├── hooks/                  # Realtime and infinite-scroll hooks
├── lib/                    # Supabase clients, types, utilities
└── tokens/
    ├── primitives.ts       # Raw values, no context
    ├── semantic.ts         # Purpose tokens
    ├── mapped.ts           # Component-context tokens
    └── index.ts            # Public token exports
```

The token dependency direction is deliberately one-way:

```text
primitives → semantic → mapped → components
```

---

## 🧑‍💻 Running Locally

**1. Clone and install**

```bash
git clone https://github.com/iamhtk/leanin-connect.git
cd leanin-connect
npm install
```

**2. Add `.env.local`**

```bash
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
SUPABASE_SERVICE_ROLE_KEY=your_secret
ANTHROPIC_API_KEY=your_key
```

**3. Start the app**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). You will land on `/auth/login`; create an account to explore the app.

---

<p align="center">
  Built with care for women navigating ambitious careers.
</p>
