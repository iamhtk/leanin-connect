# Lean In Connect

A full-stack redesign of Lean In Connect built as a Design Engineer assessment for Sandberg Goldberg Bernthal Family Foundation.

Live: https://leanin-connect.vercel.app/feed
Built by: Hrithik Sanyal
Stack: Next.js 14, TypeScript, Tailwind CSS v4, Supabase, Anthropic Claude, Vercel

---

## What I Built

Three fully functional features and four AI integrations built in 3 days.

### Feed
A redesigned community feed with real data persistence. Posts are stored in Supabase PostgreSQL and fetched via a REST API built with Next.js Route Handlers. The feed supports two levels of filtering: scope (All, Your Network, Your Circle, Saved) and topic (Negotiation, Promotions, Bias at Work, and five more). Bookmarked posts persist across sessions via localStorage.

### Opportunities
A curated job board featuring roles at companies aligned with Lean In's mission. Includes search, job type filtering, and category filtering. AI surfaces the two best-fit roles for the current user profile.

### Messages
A full messaging experience with conversation list, live chat thread, and AI-powered conversation starters. Messages receive real AI replies from Claude, role-playing as the conversation participant.

---

## Four AI Features

### AI Career Pulse (Agentic — 3 sequential agents)
Runs when the feed loads. Agent 1 detects the dominant career theme from recent post tags. Agent 2 matches that theme to a real Lean In research statistic from Women in the Workplace data. Agent 3 synthesizes an insight paragraph and three discussion questions. The result appears in the right sidebar. Each session produces different content based on what the community is discussing.

### AI Voice Coach (Streaming)
Inside the post composer, the Voice Coach transforms rough notes into a polished community post. Claude streams the response character by character into the textarea using the Anthropic streaming API, so the user watches the draft appear in real time.

### AI Job Match
When the Jobs page loads, Claude analyzes the user profile against all listings and identifies the two strongest matches. Matched listings surface at the top with a specific one-sentence reason for the match.

### AI Conversation Starter
In Messages, clicking AI Conversation Starter generates three personalized openers based on the recipient's name, role, and company. One click pre-fills the message composer.

### AI Assistant
A persistent assistant panel opened via the Sparkles icon in the topbar provides platform navigation help and answers questions about Lean In's mission and features.

---

## Design System

Visual language based on exact CSS values extracted from the live Lean In Connect platform via browser inspection, then extended with a three-tier token architecture.

tokens/primitives.ts — Raw values. No semantic meaning.
tokens/semantic.ts — Purpose-named. References primitives only.
tokens/mapped.ts — Component context. References semantic only.

Tailwind CSS v4 is configured via CSS custom properties in globals.css. Every class used in components traces back through the token chain. No hardcoded hex values exist in component files.

Components follow atomic design:
- atoms/ — Avatar, Tag
- molecules/ — PostCard, TopicFilter, CareerPulseCard
- organisms/ — Sidebar, Topbar, FeedList, PostComposer

---

## Architecture

Browser calls Next.js App Router (React + TypeScript) which calls API Routes (Node.js):

- /api/posts — GET + POST, reads and writes to Supabase
- /api/ai/career-pulse — 3-agent sequential Claude chain
- /api/ai/voice-coach — Streaming Claude response
- /api/ai/job-match — Profile to listing matching
- /api/ai/conversation-starter — Personalized openers
- /api/ai/chat-reply — Live AI chat replies
- /api/ai/assistant — Platform navigation assistant

What is real: Posts table in Supabase. All AI features call the live Anthropic API. All buttons and interactions are functional.

What is mocked: Job listings, conversations, member directory, circles, networks, groups, events, resources. All mocked data lives in typed TypeScript files in src/data/.

---

## Technical Highlights

Backend:
- Supabase Auth with email and password authentication
- Row Level Security policies on every table (profiles, posts, likes, notifications, circle_messages)
- Database triggers that auto-update likes count and create notifications when posts are liked
- Supabase Storage for profile photo uploads
- Supabase Realtime subscriptions for live notifications and circle messages
- Cursor-based pagination on the posts feed
- Auto-created user profiles via Postgres trigger on auth.users

Frontend:
- CMD+K command palette with keyboard navigation across all pages and actions
- Optimistic UI on post likes with Supabase rollback on failure
- Tiptap rich text editor with bold, italic, lists, and character counter
- Framer Motion page transitions, card animations, and sidebar active pill
- Dark mode with CSS custom property token system and localStorage persistence
- Progressive Web App manifest for installability
- WCAG 2.1 AA accessibility throughout

---

## Running Locally

Clone the repo and install dependencies with npm install.

Create .env.local with these four values:
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
ANTHROPIC_API_KEY

Run npm run dev and open http://localhost:3000
