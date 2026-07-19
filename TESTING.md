# Lean In Connect — Feature Testing Guide

Live URL: https://leanin-connect.vercel.app/feed
GitHub: https://github.com/iamhtk/leanin-connect

This document covers every feature and exactly how to verify it works.

---

## Pages (15)

| Page | Route |
|------|-------|
| Feed | /feed |
| Jobs | /jobs |
| Messages | /messages |
| Circles | /circles |
| Circle Detail | /circles/[id] |
| Networks | /networks |
| Groups | /groups |
| Directory | /directory |
| Events | /events |
| Resources | /resources |
| Resource Detail | /resources/[id] |
| Notifications | /notifications |
| Profile | /profile |
| Settings | /settings |
| Auth | /auth/login |

---

## Authentication

1. Go to the live URL — you land on /auth/login automatically
2. Click Sign up, enter any email, name, and password (8+ characters)
3. Check your email for the confirmation link and click it
4. Sign back in — you land on /feed
5. Your name and initials appear in the topbar and sidebar
6. Open /feed in an incognito window without signing in — redirects to /auth/login
7. Click Sign Out in the topbar dropdown — returns to /auth/login

---

## Backend Features

### Row Level Security

1. Open Supabase Dashboard, Table Editor for posts
2. Try inserting a row without authentication — it is blocked by RLS
3. Sign out and try to access /feed — redirects before any data loads
4. Sign in as User A and post. Sign in as User B — cannot delete User A's post

### Auto-create Profile Trigger

1. Sign up with name "Maya Rodriguez"
2. Go to Supabase Dashboard, profiles table
3. A row exists with full_name "Maya Rodriguez" and initials "MR"
   — you never created this manually

### Auto-update Likes Count Trigger

1. Sign in and go to /feed
2. Like a post — count goes up optimistically in the UI
3. Go to Supabase Dashboard, posts table
4. likes_count is already updated by the database trigger, not the app
5. Unlike — count decrements in the database automatically

### Auto-create Notification Trigger

1. Create two accounts (User A and User B)
2. Sign in as User A and create a post
3. Sign in as User B in an incognito window and like User A's post
4. Switch to User A's browser — notification bell shows a red badge
5. Open notifications — "User B liked your post" is there in real time
   without any page refresh

### Supabase Storage: Avatar Upload

1. Sign in and go to /profile
2. Hover over the large avatar circle — a camera icon appears
3. Click it and pick any photo from your device
4. The avatar updates everywhere (profile, topbar, sidebar) without refresh
5. Go to Supabase Dashboard, Storage, avatars bucket — your file is there
6. Check the profiles table — avatar_url is populated

### Cursor-based Pagination + Infinite Scroll

1. Go to /feed
2. Open the Network tab in browser devtools
3. Scroll down slowly — a new request fires to /api/posts?cursor=...&limit=10
4. The URL contains a real ISO timestamp as the cursor value
5. New posts append below without replacing existing ones
6. "You are all caught up" appears when all posts are loaded

### Supabase Realtime: Notifications

1. Sign in as User A in one browser window
2. Sign in as User B in a separate incognito window
3. Have User B like one of User A's posts
4. Watch User A's browser — the bell badge appears in real time
   without any page refresh

### Supabase Realtime: Circle Messaging

1. Open /circles/3 in two browser windows with different accounts
2. Type a message in one window and click Post to Circle
3. The message appears in the other window in real time without refresh
4. The scroll position moves to the bottom automatically

### Security: XSS Prevention

1. Open the post composer and attempt to post:
   <script>alert('xss')</script>
2. The script tags are stripped server-side before storage
3. The post renders as plain text with no script execution
4. Try posting an iframe or an img onerror attribute — both are stripped

### Error Pages

1. Navigate to /this-does-not-exist — you see the branded 404 page
   with a Back to Feed link
2. The error.tsx boundary catches render errors and shows a
   "Something went wrong" page with a Try again button

---

## AI Features

### 1. AI Career Pulse (3-Agent Agentic Chain)

1. Open /feed — the right sidebar shows "AI Career Pulse" loading
2. Within a few seconds it populates with a stat, an insight,
   and three discussion questions
3. The topic tag in the top right matches the dominant feed topic
4. Click one of the questions — the post composer opens pre-filled
5. Refresh the page — the pulse varies since it reads live post data

### 2. AI Voice Coach (Streaming)

1. Click the post composer to expand it
2. Type rough notes like: "asked for raise got denied manager said
   budget but hired 3 people same week"
3. Click the Voice Coach button (wand icon)
4. Watch the Tiptap editor fill with a polished post in real time
5. The text is fully editable after streaming completes

### 3. AI Voice Coach Topic Auto-Select

1. Run the Voice Coach as above
2. After the draft appears, watch the topic pills below the editor
3. The correct topic (e.g. "Negotiation") highlights automatically
4. The topic pill briefly pulses with a brand border

### 4. AI Job Match

1. Go to /jobs
2. The top two job cards have a purple "AI Match" badge
3. Below each badge is a one-sentence reason for the match
4. Reload — the matched jobs may differ as Claude re-evaluates

### 5. AI Salary Coach

1. Go to /jobs and click Apply on any job card
2. A modal opens with a loading skeleton
3. Three numbered negotiation tips appear, tailored to that exact role
4. Click Apply now to open the job URL
5. Try it on a different job — the tips are different

### 6. AI Conversation Starter

1. Go to /messages and open any conversation
2. Click the AI Conversation Starter button
3. Three personalized openers appear specific to the recipient
4. Click any opener — it populates the message input
5. Switch conversations — different starters appear

### 7. AI Chat Replies

1. Go to /messages, open any conversation, send a message
2. A typing indicator (three animated dots) appears
3. A reply arrives in the recipient's voice with company context
4. Send another message — the reply has full conversation history

### 8. AI Circle Recommender

1. Go to /circles
2. A horizontally scrollable "Recommended for you" row appears
3. Three circle cards appear with a left brand border and a reason
4. The reasons reflect the Design Engineer user profile
5. Click Join on any recommended circle

### 9. AI Profile Strength Coach

1. Go to /profile
2. A Profile Strength card appears with an animated progress bar
3. The score (e.g. 35%) fills in on load
4. Three suggestions appear with title, description, and impact
5. Click any action button — a toast confirms

### 10. AI Smart Search

1. Click the search bar in the topbar
2. Type "negotiation" and press Enter
3. A dropdown appears with results grouped by category
4. Try "women in tech" or "leadership" — different results
5. Click any result — navigates to the relevant page
6. Press Escape — dropdown closes

### 11. AI Key Takeaways

1. Go to /resources and click any resource card
2. The full article renders on the detail page
3. Click the sparkles button "AI Key Takeaways for your Circle"
4. A spinner shows, then 3 bullet-point takeaways appear
5. The takeaways are specific to that article's content

### 12. AI Assistant Panel

1. Click the Sparkles icon in the topbar
2. A panel opens from the right side
3. Ask "What is Lean In Connect?" — get a platform-specific answer
4. Ask "How do I join a Circle?" — navigation guidance
5. Follow-up questions are context-aware

---

## Frontend Features

### Component Interaction States

1. Hover over any button — background darkens visibly to var(--color-muted)
2. Click and hold any button — it scales down to 97% (pressed feel)
3. Tab to any button — a 2px brand-color focus ring appears with
   a soft shadow halo
4. Hover over any icon button (bell, moon, sparkles) — darker background
5. Hover over sidebar nav items — muted background with text reinforcement
6. Hover over post cards — slight lift (translateY -2px) and shadow
7. Hover over topic pills — darkened background with stronger border
8. Like button: turns brand color on active state
9. Bookmark button: brand color when saved
10. Disabled buttons: 45% opacity, cursor: not-allowed

### Dark Mode

1. Click the Moon icon in the topbar — every surface switches to dark
2. Click the Sun icon to return to light mode
3. Refresh the page — your preference is remembered
4. Open the app with OS dark mode enabled — it defaults to dark

### CMD+K Command Palette

1. Press CMD+K (Mac) or CTRL+K (Windows) from anywhere
2. The palette opens and animates in from 96% scale
3. Type "job" — Opportunities navigation appears
4. Type "dark" — the theme toggle command appears
5. Use arrow keys to navigate, Enter to execute
6. Press Escape to close
7. Focus returns to the element that had it before opening

### Pull-to-Refresh (Mobile)

1. Open /feed on a mobile device or touch-enabled screen
2. Scroll to the top of the feed so it cannot scroll further up
3. Continue pulling down — a circular spinner appears and grows
4. Pull past the threshold (80px) and release — the feed refreshes
5. The spinner animates while new posts load

### Swipe Between Tabs (Mobile)

1. On mobile, go to /feed
2. Swipe left on the feed content area — switches to "Your Network" tab
3. Swipe right — goes back to "All"
4. Go to any Circle detail page (/circles/1) and swipe between
   Feed, Members, Resources tabs

### Swipe to Reveal Actions (Mobile)

1. On mobile, swipe a post card left — a bookmark action slides in
2. Tap the bookmark icon — the post is bookmarked
3. Go to /messages on mobile, swipe a conversation row left
4. Archive button appears — tap to archive
5. Go to /notifications, swipe a notification left
6. Dismiss button appears — tap to remove it

### Swipe Down to Dismiss (Mobile)

1. On mobile, open the AI Assistant (sparkles button)
2. The panel appears as a bottom sheet with a grabber pill
3. Drag the grabber downward — the sheet follows with opacity
4. Release past the threshold — the sheet dismisses with animation
5. Open the post composer and swipe down on the header — it dismisses

### Edge Swipe: Open Sidebar (Mobile/Tablet)

1. On a screen below 1024px, start a touch drag from within
   24px of the LEFT screen edge and swipe right
2. The sidebar opens
3. Swipe left on the open sidebar to close it
4. On first page load on mobile, a brief brand-colored edge hint
   animates to show the sidebar is accessible

### Optimistic UI on Likes

1. Sign in and go to /feed
2. Click the heart on any post — count increments instantly
3. Open Network tab in devtools — Supabase request fires after the UI updated
4. Unlike — count decrements immediately
5. To test rollback: disconnect internet, try to like — count reverts

### Tiptap Rich Text Editor

1. Click the post composer to expand it
2. Toolbar shows Bold, Italic, Bullet list, Numbered list, Divider
3. Type text, select it, click Bold — text becomes bold
4. Character counter appears at bottom right
5. Counter turns amber at 400 characters, red at 500
6. Submit a formatted post — formatting renders correctly in the feed

### Framer Motion Animations

1. Navigate between any two pages — pages fade in with upward motion
2. Watch the sidebar — the active nav pill slides between items
3. Open the command palette — it scales in from 96%
4. Like a post — notification badge springs in with scale animation
5. Navigate fast between pages — AnimatePresence handles exit correctly

### PWA (Progressive Web App)

1. Open the live URL in Chrome on mobile
2. Find "Add to Home Screen" in the browser menu
3. Add it — the app installs with the Lean In icon
4. Open from Home Screen — launches in standalone mode
5. On desktop Chrome — install icon appears in the address bar

### Responsive Design

1. Desktop (1440px+): full two-column feed, sidebar, right panel
2. Tablet (768-1023px): sidebar hides, bottom tab bar appears
3. Mobile (under 768px): bottom nav, full-screen conversation in Messages
4. Feed scope tabs swipeable on all touch screens

### WCAG 2.1 AA Accessibility

1. Tab through any page — every element gets a visible 2px focus ring
2. Press Tab from the very top — "Skip to main content" link appears
3. Navigate the sidebar with keyboard only — Tab and Enter work
4. Use VoiceOver (CMD+F5 on Mac) — all buttons announce their labels
5. Open any modal — Escape closes it
6. After closing a modal — focus returns to the button that opened it
7. Like a post — screen reader announces the updated count
8. Topic filters announce aria-selected state
9. AI status changes (searching, generating) are announced via aria-live

---

## Quick Smoke Test (8 minutes)

The fastest path to verify all critical features:

1. Sign up with a new account — confirm profile auto-creates in Supabase
2. Go to /feed — confirm posts load and Career Pulse appears in sidebar
3. Like a post — confirm optimistic update, check Supabase for likes row
4. Open the composer, type rough notes, click Voice Coach
   — confirm streaming draft and auto-selected topic tag
5. Go to /jobs — confirm AI Match badges, click Apply on one
6. Go to /messages, send a message — confirm typing indicator and AI reply
7. Go to /circles — confirm AI recommended row at top
8. Go to /profile — confirm Profile Strength card with score and suggestions
9. Press CMD+K — type "dark", execute — confirm theme switches
10. Click the Moon/Sun icon — confirm dark mode toggles correctly
11. Go to /profile, hover avatar, upload a photo — confirm updates everywhere
12. Open /circles/3 in two tabs with different accounts, post in one
    — confirm real-time appearance in the other
13. On mobile or touch device: pull down on feed — confirm refresh spinner
14. On mobile: swipe left on a post card — confirm bookmark action reveals
