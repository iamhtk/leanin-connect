# Lean In Connect — Design Engineer Assessment

A full-stack redesign of Lean In Connect built as a Design
Engineer take-home assessment for Sandberg Goldberg Bernthal
Family Foundation.

Live: https://leanin-connect.vercel.app/feed
GitHub: https://github.com/iamhtk/leanin-connect
Built by: Hrithik Sanyal

---

## Stack

Next.js 14 App Router, TypeScript strict, Tailwind CSS v4,
Supabase (Auth, Database, Storage, Realtime), Anthropic Claude,
Framer Motion, Tiptap, shadcn/ui, Vercel

---

## What Is Real vs Mocked

Real: Supabase Auth, posts table and all writes, likes table,
notifications table, circle_messages table, profiles table,
Storage avatar uploads, all AI API calls via Anthropic,
Row Level Security, database triggers, Realtime subscriptions.

Mocked: Job listings, conversations, member directory, circles,
networks, groups, events, resources. All mocked data lives in
typed TypeScript files in src/data/.

---

## Pages (15)

Feed, Jobs, Messages, Circles, Circle Detail (/circles/[id]),
Networks, Groups, Directory, Events, Resources,
Resource Detail (/resources/[id]), Notifications, Profile,
Settings, Auth (/auth/login)

---

## Authentication

Email and password sign up and sign in via Supabase Auth.
A Next.js middleware protects all 13 app routes — unauthenticated
requests redirect to /auth/login with the original path preserved
as a redirectTo query parameter. On signup, a Postgres trigger
fires automatically to create a matching profile row, deriving
initials from the user's full name without any client-side code.

---

## Backend Engineering

### Row Level Security

Every table has RLS enabled with explicit policies:

posts: SELECT is public. INSERT requires auth. UPDATE and DELETE
require auth.uid() = user_id.

likes: SELECT is public. INSERT requires auth.uid() = user_id.
DELETE requires auth.uid() = user_id.

profiles: SELECT is public. INSERT and UPDATE require
auth.uid() = id.

notifications: All operations require auth.uid() = user_id.

circle_messages: SELECT is public. INSERT requires authentication.

storage.objects (avatars): SELECT is public. INSERT requires
authentication. UPDATE and DELETE require the folder name to
match the user's UUID.

### Database Triggers and Functions

handle_new_user: Fires on INSERT to auth.users. Reads
raw_user_meta_data.full_name, generates initials, and inserts
into public.profiles. Profile creation is never client-side.

update_post_likes_count: Fires on INSERT and DELETE to the likes
table. Atomically increments or decrements likes_count on the
corresponding post row. The client never writes to likes_count
directly.

create_like_notification: Fires on INSERT to likes. Looks up the
post author and the liker's profile. If the liker is not the
post author, inserts a notification row for the author. All
notification creation is handled at the database layer.

### Supabase Realtime

Two tables are published to the Realtime channel:
notifications and circle_messages.

The useRealtimeNotifications hook subscribes to
notifications filtered by user_id. When the like trigger creates
a notification, it appears in the recipient's browser
immediately with no polling.

The useCircleMessages hook subscribes to circle_messages
filtered by circle_id. Messages posted by any member appear
for all circle viewers instantly.

### Supabase Storage

A public "avatars" bucket stores profile photos at the path
{userId}/avatar.{ext}. The API route validates file type
(JPEG, PNG, WebP, GIF) and size (5MB max) server-side, uploads
with upsert so re-uploads replace the previous file, and updates
the profiles table with the cache-busted public URL.

### Cursor-based Pagination

The GET /api/posts endpoint accepts cursor (an ISO timestamp)
and limit (default 10). It fetches limit + 1 rows older than
the cursor using a less-than filter on created_at, uses the
extra result to determine hasMore, and returns nextCursor
pointing to the last post's timestamp. An IntersectionObserver
in useInfiniteScroll fires the next fetch when the sentinel
div enters the viewport.

### API Routes (13)

/api/posts — GET (cursor pagination) + POST (authenticated)
/api/profile-photo — POST (multipart, Storage upload)
/api/ai/career-pulse — 3-agent sequential Claude chain
/api/ai/voice-coach — Streaming Claude response
/api/ai/job-match — Profile to listing matching
/api/ai/salary-coach — Role-specific negotiation tips
/api/ai/conversation-starter — Personalized openers
/api/ai/chat-reply — Conversation-aware AI replies
/api/ai/circle-recommend — Profile to circle matching
/api/ai/profile-strength — Completeness analysis
/api/ai/search — Semantic search across platform data
/api/ai/classify-topic — Single-call topic classification
/api/ai/assistant — Platform navigation AI with history

---

## AI Features (11)

### AI Career Pulse (Agentic)
Three sequential Claude calls on feed load. Agent 1 identifies
the dominant career theme from current post tags. Agent 2
matches that theme to a real Lean In Women in the Workplace
research statistic. Agent 3 synthesizes an insight paragraph and
three discussion questions. Each agent's output feeds the next.
Clicking a question opens the post composer pre-filled with it.

### AI Voice Coach (Streaming)
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

## Frontend Engineering

### Design System
Three-tier token architecture in src/tokens/:
primitives.ts holds raw values with no semantic meaning.
semantic.ts maps purpose-named tokens that reference
primitives only and defines light and dark mode values.
mapped.ts holds component-context tokens that reference
semantic only. Zero hardcoded color, spacing, or radius values
exist in any component file.

### Dark Mode
A ThemeContext wraps the app and writes a data-theme attribute
to the document root. CSS custom properties in globals.css
define a complete [data-theme="dark"] token override set.
An inline script in the document head reads localStorage and
sets data-theme before React hydrates, preventing the white
flash entirely. The user's preference persists across sessions.

### CMD+K Command Palette
Full keyboard-accessible command palette with 20 commands
across five groups: Navigation, Actions, Topics, Account, and
a real-time filtered view. Arrow keys navigate, Enter selects,
Escape closes. The active item scrolls into view automatically.
A KBD hint is visible in the topbar search bar.

### Optimistic UI
Post likes update instantly in the UI before the Supabase
INSERT resolves. On server error, the count reverts to its
previous value. Bookmarks write synchronously to localStorage
and update state immediately. Both patterns eliminate perceived
latency.

### Tiptap Rich Text Editor
The post composer uses Tiptap with StarterKit, Placeholder,
and CharacterCount extensions. The toolbar supports bold,
italic, bullet lists, numbered lists, and horizontal rules.
A character counter turns amber at 80% and red at the 500
character limit. Posted HTML renders safely in the feed via a
sanitize function that strips scripts and event attributes.

### Framer Motion
Page transitions use AnimatePresence with a 180ms ease-out
enter and 120ms ease-in exit. The sidebar active indicator
uses layoutId so the active pill slides between nav items with
a spring animation. Post cards animate in on load. The command
palette scales in from 96% with a custom cubic bezier. The
notification badge scales in with a spring on first appearance.

### PWA
A manifest.json registers the app as installable with a name,
short name, start URL at /feed, standalone display, theme color,
and three home screen shortcuts for Feed, Messages, and Jobs.
The app is installable from Chrome on Android, iOS Safari, and
desktop Chrome.

### Responsive Design
Four token scales defined as CSS custom properties:
Mobile (default, 0-767px), Tablet (768px), Desktop (1024px),
Large (1440px). Mobile shows a bottom tab bar with five items
and hides the desktop sidebar. The messages layout switches to
full-screen conversation view on mobile. Post grids collapse to
single column. Touch targets are 44px minimum throughout.

### WCAG 2.1 AA
All interactive elements have visible focus indicators (2px
brand color, 2px offset). Every page has a main landmark with
aria-label. All buttons, tabs, and form controls have aria-label
or visible labels. Topic filters use role="tablist" and
aria-selected. The like button announces count to screen readers.
A skip-to-content link is the first focusable element. Reduced
motion is respected via prefers-reduced-motion.

---

## Design System Architecture

src/tokens/primitives.ts — Raw oklch() values, no context
src/tokens/semantic.ts — Purpose tokens, references primitives
src/tokens/mapped.ts — Component tokens, references semantic
src/tokens/index.ts — Re-exports all three

src/components/atoms/ — Avatar, Tag, FadeIn
src/components/molecules/ — PostCard, TopicFilter, CareerPulseCard,
  TrendingTopics, SuggestedMembers, RichTextEditor
src/components/organisms/ — Sidebar, Topbar, FeedList,
  PostComposer, MobileNav, AIAssistant, CommandPalette
src/contexts/ — AuthContext, ThemeContext
src/hooks/ — useRealtimeNotifications, useCircleMessages,
  useInfiniteScroll

---

## Running Locally

Clone the repo and run npm install.

Create .env.local:
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
SUPABASE_SERVICE_ROLE_KEY=your_secret
ANTHROPIC_API_KEY=your_key

Run npm run dev and open http://localhost:3000.
You land on /auth/login. Create an account to explore the app.

---
