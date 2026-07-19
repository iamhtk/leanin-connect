<p align="center">
  <img src="./public/icon.svg" alt="Lean In Connect" width="92" height="92" />
</p>

<h1 align="center">Lean In Connect — Feature Testing Guide</h1>

<p align="center">
  <strong>Every feature in the app, and exactly how to verify each one works.</strong>
</p>

<p align="center">
  <a href="https://leanin-connect.vercel.app/feed"><strong>Live app</strong></a>
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

- **15 product pages** with route-level checks
- **Auth + RLS + database triggers** verified end to end
- **11 AI features** with step-by-step reproduction paths
- **Frontend polish** covering dark mode, CMD+K, optimistic UI, PWA, and accessibility

## 🧭 Contents

- [Pages](#-pages-15)
- [Authentication](#-authentication)
- [Backend Features](#-backend-features)
- [AI Features](#-ai-features)
- [Frontend Features](#-frontend-features)
- [Quick Smoke Test](#-quick-smoke-test-5-minutes)

---

## 🗺️ Pages (15)

| Page | Route |
|------|-------|
| Feed | `/feed` |
| Jobs | `/jobs` |
| Messages | `/messages` |
| Circles | `/circles` |
| Circle Detail | `/circles/[id]` |
| Networks | `/networks` |
| Groups | `/groups` |
| Directory | `/directory` |
| Events | `/events` |
| Resources | `/resources` |
| Resource Detail | `/resources/[id]` |
| Notifications | `/notifications` |
| Profile | `/profile` |
| Settings | `/settings` |
| Auth | `/auth/login` |

---

## 🔐 Authentication

### Email and Password Auth

1. Go to [leanin-connect.vercel.app](https://leanin-connect.vercel.app) — you land on `/auth/login` automatically
2. Click Sign up, enter any email, a name, and a password (8+ characters)
3. Check your email for the confirmation link and click it
4. Sign back in at `/auth/login` — you land on `/feed`
5. Your name and initials appear in the topbar avatar and sidebar bottom
6. Open `/feed` in an incognito window without signing in — it redirects to `/auth/login`
7. Click Sign Out in the topbar profile dropdown — you return to `/auth/login`

---

## 🗄️ Backend Features

### 🛡️ Row Level Security

1. Go to Supabase Dashboard, open the Table Editor for posts
2. Try inserting a row directly without authentication — it is blocked
3. Sign out and try to access `/feed` — the page redirects before any data loads
4. Sign in as User A, create a post. Sign in as User B — they cannot delete User A's post

### ⚙️ Database Trigger: Auto-create Profile

1. Sign up with a new account using the name "Maya Rodriguez"
2. Go to Supabase Dashboard and open the profiles table
3. A row exists with `full_name` "Maya Rodriguez" and initials "MR" — you never created this manually

### ⚙️ Database Trigger: Auto-update Likes Count

1. Sign in and go to `/feed`
2. Like a post — the count goes up in the UI immediately
3. Go to Supabase Dashboard and check the posts table — `likes_count` is already updated by the database trigger, not the app
4. Unlike it — the count decrements in the database automatically

### ⚙️ Database Trigger: Auto-create Notification on Like

1. Create two accounts (User A and User B)
2. Sign in as User A and create a post
3. Sign in as User B in an incognito window and like User A's post
4. Switch back to User A's browser — the notification bell shows a red badge
5. Open notifications — "User B liked your post" is there in real time without a page refresh

### 📦 Supabase Storage: Avatar Upload

1. Sign in and go to `/profile`
2. Hover over the large avatar circle in the profile header — a camera icon appears
3. Click it and pick any photo from your device
4. The avatar updates everywhere (profile page, topbar, sidebar) without a page refresh
5. Go to Supabase Dashboard, Storage, avatars bucket — your file is there
6. Check the profiles table — `avatar_url` is populated

### 📄 Cursor-based Pagination

1. Go to `/feed`
2. Open the Network tab in browser devtools
3. Scroll down slowly — when you near the bottom, a new request fires to `/api/posts?cursor=...&limit=10`
4. The URL contains a real ISO timestamp as the cursor value
5. New posts append below without replacing existing ones
6. When all posts are loaded, "You are all caught up" appears at the bottom

### ⚡ Supabase Realtime: Notifications

1. Sign in as User A in one browser window
2. Sign in as User B in a separate incognito window
3. Have User B like one of User A's posts
4. Watch User A's browser — the bell icon badge appears in real time without any page refresh

### ⚡ Supabase Realtime: Circle Messaging

1. Open `/circles/3` in two browser windows with different accounts
2. Type a message in one window and click Post to Circle
3. The message appears in the other window in real time without a refresh
4. The scroll position moves to the bottom automatically

---

## 🤖 AI Features

### 1. AI Career Pulse (3-Agent Agentic Chain)

1. Open `/feed` — the right sidebar shows "AI Career Pulse" loading
2. Within a few seconds it populates with a stat, an insight, and three discussion questions
3. The topic tag in the top right matches the dominant feed topic
4. Click one of the discussion questions — the post composer opens pre-filled with that question
5. Refresh the page — the pulse may vary since it reads live post data

### 2. AI Voice Coach (Streaming)

1. Click "Share something with the community..." to open the composer
2. Type rough notes such as: "asked for raise got denied manager said budget but hired 3 people same week"
3. Click the Voice Coach button (wand icon)
4. Watch the Tiptap editor fill with a polished post in real time, one character at a time
5. The text is fully editable after streaming completes

### 3. AI Voice Coach Topic Auto-Select

1. Run the Voice Coach as above
2. After the draft appears, watch the topic pills below the editor
3. The correct topic (e.g. "Negotiation" for a salary post) highlights automatically
4. The topic pill briefly pulses with a brand border before settling

### 4. AI Job Match

1. Go to `/jobs`
2. The top two job cards have a purple "AI Match" badge with a Sparkles icon
3. Below each badge is a one-sentence reason specific to that role and the user profile
4. Reload — the matched jobs may differ as Claude re-evaluates each time

### 5. AI Salary Coach

1. Go to `/jobs`
2. Click Apply on any job card (e.g. "Senior Product Designer at Notion")
3. A modal opens showing the job pill and a loading skeleton
4. Three numbered negotiation tips appear, each tailored to that exact role and company
5. Click Apply now to open the job URL, or Maybe later to dismiss
6. Try it on a different job — the tips are different

### 6. AI Conversation Starter

1. Go to `/messages` and open any conversation (e.g. Priya Sharma)
2. Click the AI Conversation Starter button above the message input
3. Three personalized openers appear specific to Priya's role at Stripe
4. Click any opener — it populates the message input
5. Switch to a different conversation and try again — the starters are different

### 7. AI Chat Replies

1. Go to `/messages` and open any conversation
2. Type any message and send it
3. A typing indicator (three animated dots) appears from the recipient
4. A reply arrives from the recipient in their voice, aware of their role and company
5. Send another message — the reply has full conversation history context

### 8. AI Circle Recommender

1. Go to `/circles`
2. A horizontally scrollable row appears above the main grid labeled "Recommended for you"
3. Three circle cards appear with a left brand border and a specific reason each
4. The reasons reflect the Design Engineer user profile
5. Click Join on any recommended circle

### 9. AI Profile Strength Coach

1. Go to `/profile`
2. A "Profile Strength" card appears in the right column with a progress bar
3. The score (e.g. 35%) animates in via the progress bar on load
4. Three suggestions appear, each with a title, description, impact statement, and action button
5. Click any action button — a toast confirms the action

### 10. AI Smart Search

1. Click the search bar in the topbar
2. Type "negotiation" and press Enter
3. A dropdown appears with results grouped by circles, members, resources, and topics
4. Try "women in tech" — different categorized results appear
5. Try "leadership" — matching topics and circles appear
6. Click any result — navigates to the relevant page
7. Press Escape — dropdown closes

### 11. AI Key Takeaways (Resource Detail)

1. Go to `/resources`
2. Click any resource card (e.g. "How to negotiate so everyone wins")
3. The full article content renders on the detail page
4. Click the sparkles button "AI Key Takeaways for your Circle"
5. A loading spinner shows, then 3 bullet-point takeaways appear above the article
6. The takeaways are specific to that article's content

### 12. AI Assistant Panel

1. Click the Sparkles icon in the topbar
2. A panel opens from the right side
3. Ask "What is Lean In Connect?" — get a platform-specific answer
4. Ask "How do I join a Circle?" — get navigation guidance
5. Follow-up questions are context-aware across the conversation

---

## 🎨 Frontend Features

### 🌙 Dark Mode

1. Click the Moon icon in the topbar — every surface switches to dark
2. Click the Sun icon to return to light mode
3. Refresh the page — your preference is remembered
4. Open the app in a browser with OS dark mode enabled — it defaults to dark on first load

### ⌘ CMD+K Command Palette

1. Press CMD+K (Mac) or CTRL+K (Windows) from anywhere in the app
2. The palette opens with a search input and grouped commands
3. Type "job" — the Opportunities navigation command appears
4. Type "dark" — the theme toggle command appears
5. Use arrow keys to navigate, Enter to execute a command
6. Press Escape to close
7. The CMD+K hint is visible in the topbar search bar at all times

### ⚡ Optimistic UI on Likes

1. Sign in and go to `/feed`
2. Click the heart on any post — the count increments instantly before any server response
3. Open the Network tab in devtools — the Supabase request fires after the UI already updated
4. Unlike it — the count decrements immediately
5. To test rollback: disconnect your internet, try to like a post — the count goes up then reverts

### ✍️ Tiptap Rich Text Editor

1. Click the post composer to expand it
2. The toolbar shows Bold, Italic, Bullet list, Numbered list, and Divider tools
3. Type some text, select it, click Bold — text becomes bold
4. Click the bullet list icon — the paragraph converts to a list
5. A character counter appears at the bottom right once you start typing
6. The counter turns amber at 400 characters (80%) and red at 500 (100%)
7. Submit a formatted post — the formatting renders correctly in the feed

### ✨ Framer Motion Page Transitions

1. Navigate between any two pages using the sidebar
2. Each page fades in with a subtle upward motion using a cubic bezier curve
3. Watch the sidebar — the active nav pill slides smoothly between items with a spring animation
4. Open the command palette — it scales in from 96% with a custom easing curve
5. Watch the notification bell badge — it scales in with a spring when the unread count first appears

### 📱 PWA (Progressive Web App)

1. Open the live URL in Chrome on mobile
2. Find "Add to Home Screen" in the browser menu
3. Add it — the app installs with the Lean In icon
4. Open from the Home Screen — it launches in standalone mode with no browser chrome
5. On desktop Chrome: look for the install icon in the address bar on the right side

### 📐 Responsive Design

1. On desktop (1440px+): full two-column feed, sidebar visible, right panel visible
2. Resize to tablet (768-1023px): right sidebar hides, feed goes single column
3. Resize to mobile (under 768px): sidebar disappears, bottom tab bar with five items appears
4. On mobile, tap any tab in the bottom nav — navigation works
5. Open Messages on mobile — tapping a conversation goes full-screen into that chat

### ♿ WCAG 2.1 AA Accessibility

1. Tab through any page — every interactive element gets a visible focus ring (2px brand color)
2. Press Tab from the very top of any page — a "Skip to main content" link appears first
3. Navigate the sidebar using keyboard only: Tab to move between items, Enter to navigate
4. Use VoiceOver on Mac (CMD+F5) — every button announces its label
5. The like button reads "Like, 47 likes" to screen readers
6. Topic filter pills announce `role="tab"` and `aria-selected` state when focused

---

## 🚀 Quick Smoke Test (5 minutes)

If you want to verify the most critical paths in one pass:

1. Sign up with a new account — confirm profile auto-creates
2. Go to `/feed` — confirm posts load and Career Pulse appears in sidebar
3. Like a post — confirm optimistic update, then check Supabase dashboard for likes row
4. Open the post composer, type rough notes, click Voice Coach — confirm streaming draft and auto-selected topic
5. Go to `/jobs` — confirm AI Match badges on top two cards, click Apply on one
6. Go to `/messages`, send a message — confirm typing indicator and AI reply
7. Go to `/circles` — confirm recommended row at top
8. Go to `/profile` — confirm Profile Strength card with score and suggestions
9. Press CMD+K — confirm palette opens, type "dark", execute — confirm theme switches
10. Go to `/profile`, hover avatar, upload a photo — confirm it updates everywhere
