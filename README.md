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
  <img alt="Next.js" src="https://img.shields.io/badge/Next.js-16-000000?style=flat-square&logo=nextdotjs" />
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-strict-3178C6?style=flat-square&logo=typescript&logoColor=white" />
  <img alt="Supabase" src="https://img.shields.io/badge/Supabase-Realtime-3FCF8E?style=flat-square&logo=supabase&logoColor=white" />
  <img alt="Anthropic" src="https://img.shields.io/badge/AI-Claude-D97757?style=flat-square&logo=anthropic&logoColor=white" />
  <img alt="Vercel" src="https://img.shields.io/badge/Deployed-Vercel-000000?style=flat-square&logo=vercel" />
</p>

---

## ✨ At a Glance

- **15 product pages** across community, career, messaging, and account experiences
- **12 AI features** powered by Claude, including streaming and multi-agent workflows
- **Realtime collaboration** through live notifications and Circle messages
- **Mobile swipe gestures** — pull-to-refresh, swipe-to-reveal, tab swipes, bottom-sheet dismiss, edge swipe
- **Production-minded frontend** with optimistic UI, cursor pagination, PWA support, and WCAG 2.1 AA

## 🧭 Contents

- [Stack](#-stack)
- [Five-Minute Reviewer Path](#-five-minute-reviewer-path)
- [What Is Real vs Mocked](#-what-is-real-vs-mocked)
- [Pages](#-pages-15)
- [Authentication](#-authentication)
- [Backend Engineering](#-backend-engineering)
- [AI Features](#-ai-features-12)
- [Frontend Engineering](#-frontend-engineering)
- [Design System Architecture](#-design-system-architecture)
- [Running Locally](#-running-locally)
- [Tradeoffs and Next Steps](#-tradeoffs-and-next-steps)

---

## 🧰 Stack

`Next.js 16` · `TypeScript` · `Tailwind CSS v4` · `Supabase` ·
`Anthropic Claude` · `Framer Motion` · `Tiptap` · `shadcn/ui` · `Vercel`

> Supabase powers authentication, PostgreSQL, Storage, and Realtime. Claude powers every AI workflow through server-only API routes.

---

## ⏱️ Five-Minute Reviewer Path

1. Open the demo link — you are signed in automatically
2. Go to Feed — create a post using AI Voice Coach and watch it stream
3. Like a post — watch the notification bell badge appear in real time
4. Open /circles/3 — post a message and watch it appear live in a second tab
5. Go to /jobs — check AI Match badges, click Apply for the Salary Coach
6. Press CMD+K from anywhere — explore the command palette
7. Read the Architecture and Tradeoffs sections below for decisions

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
requests redirect to `/auth/login` with the original path preserved
as a `redirectTo` query parameter. On signup, a Postgres trigger
fires automatically to create a matching profile row, deriving
initials from the user's full name without any client-side code.

---

## 🗄️ Backend Engineering

### 🛡️ Row Level Security

Every table has RLS enabled with explicit policies:

- **`posts`** — Public `SELECT`. Authenticated `INSERT`. `UPDATE` / `DELETE` require `auth.uid() = user_id`
- **`likes`** — Public `SELECT`. `INSERT` / `DELETE` require `auth.uid() = user_id`
- **`profiles`** — Public `SELECT`. `INSERT` / `UPDATE` require `auth.uid() = id`
- **`notifications`** — All operations require `auth.uid() = user_id`
- **`circle_messages`** — Public `SELECT`. Authenticated `INSERT`
- **`storage.objects` (avatars)** — Public `SELECT`. Authenticated `INSERT`. `UPDATE` / `DELETE` require the folder name to match the user UUID

### ⚙️ Database Triggers and Functions

**`handle_new_user`** — Fires on `INSERT` to `auth.users`. Reads
`raw_user_meta_data.full_name`, generates initials, and inserts
into `public.profiles`. Profile creation is never client-side.

**`update_post_likes_count`** — Fires on `INSERT` and `DELETE` to the likes
table. Atomically increments or decrements `likes_count` on the
corresponding post row. The client never writes to `likes_count`
directly.

**`create_like_notification`** — Fires on `INSERT` to likes. Looks up the
post author and the liker's profile. If the liker is not the
post author, inserts a notification row for the author. All
notification creation is handled at the database layer.

### ⚡ Supabase Realtime

Two tables are published to the Realtime channel:
`notifications` and `circle_messages`.

**`useRealtimeNotifications`** subscribes to notifications filtered
by `user_id`. When the like trigger creates a notification, it
appears in the recipient's browser immediately with no polling.

**`useCircleMessages`** subscribes to `circle_messages` filtered by
`circle_id`. Messages posted by any member appear for all circle
viewers instantly.

### 📦 Supabase Storage

A public `avatars` bucket stores profile photos at the path
`{userId}/avatar.{ext}`. The API route validates file type
(JPEG, PNG, WebP, GIF) and size (5MB max) server-side, uploads
with upsert so re-uploads replace the previous file, and updates
the profiles table with the cache-busted public URL.

### ♾️ Cursor-based Pagination

The `GET /api/posts` endpoint accepts `cursor` (an ISO timestamp)
and `limit` (default 10). It fetches `limit + 1` rows older than
the cursor, uses the extra result to determine `hasMore`, and
returns `nextCursor` pointing to the last post's timestamp.
An `IntersectionObserver` in `useInfiniteScroll` fires the next
fetch when the sentinel div enters the viewport.

### 🔒 Security

Post content is sanitized on the server before storage,
stripping script tags, iframes, inline event handlers, and
`javascript:` URIs. Only a whitelist of safe HTML tags is
permitted through to the database. Topic tags are validated
against a fixed allowed list. All AI API routes validate
input length before calling Anthropic.

### 🔌 API Routes (14)

- **`/api/posts`** — `GET` (cursor pagination) + `POST` (authenticated, validated)
- **`/api/profile-photo`** — Multipart validation and Storage upload
- **`/api/ai/classify-topic`** — Voice Coach topic auto-selection
- **`/api/ai/career-pulse`** — Three-agent sequential Claude chain
- **`/api/ai/voice-coach`** — Streaming Claude response
- **`/api/ai/job-match`** — Profile-to-listing matching
- **`/api/ai/salary-coach`** — Role-specific negotiation tips
- **`/api/ai/conversation-starter`** — Personalized openers
- **`/api/ai/chat-reply`** — Conversation-aware AI replies
- **`/api/ai/circle-recommend`** — Profile-to-Circle matching
- **`/api/ai/profile-strength`** — Completeness analysis
- **`/api/ai/search`** — Semantic search across platform data
- **`/api/ai/assistant`** — Platform navigation AI with history

---

## 🤖 AI Features (12)

### AI Career Pulse · Agentic
Three sequential Claude calls on feed load. Agent 1 identifies
the dominant career theme from current post tags. Agent 2
matches that theme to a real Lean In Women in the Workplace
research statistic. Agent 3 synthesizes an insight paragraph
and three discussion questions. Clicking a question opens the
post composer pre-filled with it.

### AI Voice Coach · Streaming + Topic Auto-Select
Transforms rough notes into a polished community post using
the Anthropic streaming API. The response streams character by
character into the Tiptap editor. After streaming completes, a
second call to `/api/ai/classify-topic` auto-selects the most
relevant topic tag with a visual pulse animation.

### AI Job Match
On Jobs page load, Claude evaluates all listings against the
user profile and surfaces the top two matches with a specific
one-sentence reason each.

### AI Salary Coach
Clicking Apply opens a modal that immediately fetches three
negotiation tips specific to the exact role, company, and
salary range. Includes a direct Apply link and a dismiss option.

### AI Conversation Starter
Generates three personalized conversation openers based on the
recipient's name, role, and company. One click pre-fills the
message input.

### AI Chat Replies
Every sent message triggers a Claude reply role-playing as the
conversation participant with full conversation history context.
A typing indicator appears for 1.5 seconds before the reply renders.

### AI Circle Recommender
On Circles page load, Claude matches the user profile against
all available circles and returns the top three recommendations
with a specific reason per circle.

### AI Profile Strength Coach
Analyzes profile completeness and returns a 0–100 score with
three improvement suggestions each including a measurable
impact statement.

### AI Smart Search
The topbar search sends queries to Claude on Enter. Results
are categorized across circles, members, resources, and topics
with direct navigation links.

### AI Key Takeaways
On every resource detail page, a sparkles button sends the
article content to Claude and returns three bullet-point
takeaways formatted for sharing with a Circle.

### AI Assistant
A persistent right-side panel opened via the Sparkles icon in
the topbar. Full conversation history is maintained per session.

### AI Topic Classifier
After Voice Coach streaming completes, a second lightweight
Claude call classifies the post into exactly one topic from
the predefined list and auto-selects the matching pill.

---

## 🎨 Frontend Engineering

### 🧩 Design System
Three-tier token architecture in `src/tokens/`.
`primitives.ts` holds raw values. `semantic.ts` maps purpose-named
tokens that reference primitives only and defines light and dark
mode values. `mapped.ts` holds component-context tokens that
reference semantic only. Zero hardcoded color, spacing, or
radius values exist in any component file.

### 🖱️ Component Interaction States
Every interactive element has explicit hover, active/pressed,
focus, and disabled states defined in `globals.css` as composable
CSS classes (`.btn-primary`, `.btn-secondary`, `.btn-ghost`,
`.btn-follow`, `.icon-btn`, `.action-btn`, `.pill-filter`, `.tab-item`,
`.nav-item`, `.card-hover`, `.conv-item`, `.input-field`, and more).
Hover backgrounds use `var(--color-muted)` for accessible contrast.
All active states use `transform: scale` for a physical pressed feel.
All `focus-visible` states show a 2px brand-color outline with a
soft shadow ring.

### 👆 Mobile Swipe Gestures (6 types)

| Hook | Behavior |
|------|----------|
| **`useSwipe`** | Base horizontal and vertical swipe detection with velocity threshold and axis locking |
| **`usePullToRefresh`** | Pull-down-to-refresh on the feed with a visual spinner that scales with pull progress |
| **`useSwipeReveal`** | Swipe left on post cards (bookmark), conversation rows (archive), notifications (dismiss) |
| **`useSwipeTabs`** | Horizontal swipe between feed scope tabs and Circle detail tabs |
| **`useBottomSheetDismiss`** | Swipe down on the AI Assistant grabber to dismiss on mobile, with opacity and `translateY` feedback |
| **`useEdgeSwipe`** | Drag from within 24px of the left screen edge to open the sidebar on tablet and mobile |

### 🌙 Dark Mode
A `ThemeContext` wraps the app and writes a `data-theme` attribute
to the document root. CSS custom properties in `globals.css`
define a complete dark mode token override. An inline script
in the document head reads `localStorage` and sets `data-theme`
before React hydrates, preventing the white flash entirely.

### ⌨️ CMD+K Command Palette
Full keyboard-accessible command palette with 20 commands
across five groups. Arrow keys navigate, Enter selects,
Escape closes. Focus restores to the triggering element on close.

### 🚀 Optimistic UI
Post likes update instantly in the UI before the Supabase
`INSERT` resolves. On server error, the count reverts.
Bookmarks write synchronously to `localStorage` and update
state immediately.

### ✍️ Tiptap Rich Text Editor
The post composer uses Tiptap with StarterKit, Placeholder,
and CharacterCount extensions. Bold, italic, bullet lists,
numbered lists, and horizontal rules. Character counter turns
amber at 80% and red at the 500 character limit.

### 🎬 Framer Motion
Page transitions use `AnimatePresence` with 180ms ease-out enter
and 120ms ease-in exit. The sidebar active indicator uses
`layoutId` for a spring slide between nav items. The notification
badge scales in with a spring on first appearance. The command
palette scales in from 96% with a custom cubic bezier.

### 📱 Progressive Web App
A `manifest.json` registers the app as installable with standalone
display, theme color, and three home screen shortcuts for Feed,
Messages, and Jobs.

### 📐 Responsive Design
Four token scales as CSS custom properties:
Mobile (0–767px), Tablet (768px), Desktop (1024px), Large (1440px).
Mobile shows a bottom tab bar and hides the desktop sidebar.
The messages layout switches to full-screen conversation on mobile.
Touch targets are 44px minimum throughout.

### ♿ WCAG 2.1 AA
All interactive elements have visible focus indicators.
Every page has a main landmark with `aria-label`.
All buttons have `aria-label` or visible text labels.
Topic filters use `role="tablist"` and `aria-selected`.
Async status changes are announced via `aria-live="polite"`.
A skip-to-content link is the first focusable element.
Reduced motion is respected via `prefers-reduced-motion`.
Modal dialogs have `role="dialog"` `aria-modal="true"` and
Escape key handling. Focus restores to the trigger element
on modal close.

### 🧯 Error Handling
`src/app/error.tsx` provides a branded recovery page for
render errors with a Try Again button that calls `reset()`.
`src/app/not-found.tsx` provides a branded 404 page.
All async hooks (`useRealtimeNotifications`, `useCircleMessages`,
`AuthContext`) wrap Supabase calls in try/catch with graceful
degradation.

---

## 🏗️ Design System Architecture

```text
src/
├── app/                    # Pages, layouts, and API routes
├── components/
│   ├── atoms/              # Avatar, Tag, FadeIn
│   ├── molecules/          # PostCard, TopicFilter, CareerPulseCard,
│   │                       # TrendingTopics, SuggestedMembers, RichTextEditor
│   └── organisms/          # Sidebar, Topbar, FeedList, PostComposer,
│                           # MobileNav, AIAssistant, CommandPalette
├── contexts/               # AuthContext, ThemeContext
├── data/                   # Typed mock data
├── hooks/                  # Realtime, infinite scroll, and gesture hooks
│                           # useRealtimeNotifications, useCircleMessages,
│                           # useInfiniteScroll, useSwipe, usePullToRefresh,
│                           # useSwipeReveal, useSwipeTabs,
│                           # useBottomSheetDismiss, useEdgeSwipe
├── lib/                    # Supabase clients, types, utilities
└── tokens/
    ├── primitives.ts       # Raw oklch() values, no context
    ├── semantic.ts         # Purpose tokens → primitives
    ├── mapped.ts           # Component tokens → semantic
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

## ⚖️ Tradeoffs and Next Steps

**Scope decision**
I started with the core requested slice — Feed, Messages, and Jobs —
then used the same reusable architecture to demonstrate how the
experience scales across the broader Lean In Connect platform.
The token system, component state classes, gesture hooks, and
API patterns are all built to be composable, so each additional
page required minimal incremental effort.

**Testing**
Because of the assessment timeframe I prioritized a complete
functioning product with documented manual verification over
an automated test suite. TESTING.md in the repo walks through
every feature step by step.

The first automated tests I would add:

- Authentication flow and protected route tests
- Post creation and server-side XSS sanitization tests
- RLS ownership policy tests (user cannot modify another user's data)
- Optimistic like rollback test (server failure reverts count)
- Realtime notification delivery test across two sessions
- Playwright end-to-end smoke flow covering the five-minute reviewer path

**What I would build next with more time**
- Real social graph: follows and circle_memberships tables so
  Your Network and Your Circle tabs show actual connections
- Rate limiting on AI routes using Upstash Redis to prevent
  cost abuse in production
- Full-text search using Postgres tsvector indexing instead of
  sending a static list to Claude
- Automated test suite covering the cases above

---

<p align="center">
  Built with care for women navigating ambitious careers.
</p>
