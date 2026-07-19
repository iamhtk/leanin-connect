<!-- @AGENTS.md -->
# Lean In Connect — Design Engineer Assessment
**Built by Hrithik Sanyal for SGBFF Design Engineer role**

## Project Overview
A redesigned Lean In Connect platform built as a full-stack prototype.
Three features: Feed (real Supabase backend), Job Board (mocked), 
Chat/Messages (mocked). Four AI features: Career Pulse agent chain,
Voice Coach streaming, Job Match labels, Conversation Starter suggestions.
The mission: help women grow their careers through community, 
research, and education.

## Stack
- Framework: Next.js 14 App Router
- Language: TypeScript (strict mode, no any types ever)
- Styling: Tailwind CSS extended with design tokens
- Components: shadcn/ui (Nova preset, Radix UI) + custom atomic system
- Animation: Framer Motion
- Database: Supabase (PostgreSQL) — posts table only
- API: Next.js Route Handlers (Way 2 — explicit REST endpoints)
- AI: Anthropic Claude claude-sonnet-4-6 via @anthropic-ai/sdk
- Deployment: Vercel
- Icons: Lucide React

## Font
DM Sans from Google Fonts. Import in layout.tsx using next/font/google.
Weight variants: 400, 500, 600, 700.

## Folder Structure
src/
  tokens/
    primitives.ts    → Raw values only. No meaning.
    semantic.ts      → Purpose-named. References primitives only.
    mapped.ts        → Component context. References semantic only.
    index.ts         → Re-exports all three.
  components/
    atoms/           → Smallest indivisible UI elements
    molecules/       → 2+ atoms with single responsibility
    organisms/       → Full UI sections
    ui/              → shadcn generated components (do not edit manually)
  app/
    page.tsx         → Redirects to /feed
    layout.tsx       → Root layout with sidebar + topbar
    feed/
      page.tsx       → Feed page
    jobs/
      page.tsx       → Job board page
    messages/
      page.tsx       → Chat/messages page
    api/
      posts/
        route.ts     → GET all posts, POST new post
      ai/
        career-pulse/
          route.ts   → 3-agent chain: detect theme → find stat → synthesize
        voice-coach/
          route.ts   → Stream Claude response for post drafting
        job-match/
          route.ts   → Match user profile to job listings
        conversation-starter/
          route.ts   → Suggest 3 conversation openers
  lib/
    supabase.ts      → Supabase client (browser)
    supabase-server.ts → Supabase client (server/API routes)
    utils.ts         → cn() and other utilities
    types.ts         → All TypeScript interfaces
  data/
    jobs.ts          → Mock job listings (6-8 entries)
    conversations.ts → Mock chat conversations (3 entries)
    research-stats.ts → Lean In research stats for Career Pulse (15 entries)
  hooks/
    usePosts.ts      → Custom hook for feed data

## Design Token Rules — NEVER BREAK THESE
- Zero hardcoded hex values anywhere in component code
- Zero inline styles (no style={{ color: '#...' }})
- All values trace: mapped → semantic → primitive
- Use Tailwind classes that map to tokens via tailwind.config.ts
- Token class names: bg-brand, text-muted, border-default, etc.

## Component Rules
- Atoms: single element, props-driven, no children composition logic
- Molecules: composed of atoms, single clear responsibility
- Organisms: full sections, compose molecules and atoms
- Every component: TypeScript with explicit named Props interface
- Named exports only — no default exports from component files
- Props interface named: ComponentNameProps
- 'use client' only when component uses hooks, events, or browser APIs

## Code Conventions
- TypeScript strict mode always
- No 'any' types — use 'unknown' and narrow, or proper interfaces
- async/await not .then()
- Early returns over nested conditionals
- Descriptive variable names — no single letter vars except map/filter index
- No commented-out code in final files

## API Route Conventions
- All routes: /app/api/[resource]/route.ts
- Export named functions: GET, POST (uppercase)
- Always return NextResponse.json()
- Always wrap in try/catch
- Success shape: { data: ... }
- Error shape: { error: string }
- Never expose ANTHROPIC_API_KEY or SUPABASE_SERVICE_ROLE_KEY to client

## AI Feature Conventions
- All AI calls from API routes only, never from client components
- Model: claude-sonnet-4-6
- Max tokens: 1024 for labels/short outputs, 2048 for post drafts
- Always include system prompt that grounds Claude in Lean In mission
- Streaming: use ReadableStream for Voice Coach only
- All other AI features: standard JSON response

## Supabase Conventions
- Browser client: import from @/lib/supabase
- Server client: import from @/lib/supabase-server
- Only the posts table is real. Everything else is mock data.
- Never use supabase directly in page components — always via API routes

## Motion Conventions (Framer Motion)
- Card entrance: opacity 0→1, y 12→0, duration 0.3, ease easeOut
- Stagger children: 0.06s between each card
- Card hover: y -2, shadow upgrade, duration 0.15
- Modal open: scale 0.97→1, opacity 0→1, duration 0.2
- Modal close: scale 1→0.97, opacity 1→0, duration 0.15
- Tag hover: scale 1.03, duration 0.1
- Button press: scale 0.97, duration 0.1
- Never animate layout shifts — only opacity, transform, shadow

## What NOT To Do
- Never hardcode colors, spacing, or radius values
- Never use default exports from component files
- Never call Anthropic API from client components
- Never call Supabase directly from page components
- Never use .then() for async operations
- Never create components outside the atomic folder structure
- Never install new packages without checking if functionality exists
- Never use <img> — always use next/image
- Never leave console.log in final code
- Never use any TypeScript type

## Mock Data Rules
- Jobs: 6-8 listings, real companies with Lean In alignment
- Conversations: 3 threads, realistic names, career-focused content
- Research stats: 15 entries from real Lean In Women in the Workplace data
- All mock data lives in /src/data/ as typed TypeScript exports

## The Mission Context
Every design and copy decision should reflect that this platform
exists to help women advance their careers. Post content, job listings,
AI outputs, and empty states should feel warm, empowering, and specific
to the challenges women face at work — not generic social media.