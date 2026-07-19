import { Conversation } from '@/lib/types'

export const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: '1',
    participant_name: 'Sarah Chen',
    participant_role: 'Director of Marketing',
    participant_company: 'Figma',
    participant_initials: 'SC',
    participant_avatar_color: '#B45309',
    last_message: 'That negotiation script you shared worked perfectly. I got the offer!',
    last_message_at: '2026-07-18T20:30:00Z',
    unread_count: 2,
    messages: [
      {
        id: '1-1',
        content: 'Hi! I saw your post about salary negotiation. I have a conversation coming up next week and I\'m nervous. Any advice?',
        sent_at: '2026-07-18T18:00:00Z',
        is_sent: false,
      },
      {
        id: '1-2',
        content: 'Of course! The biggest thing is to come in with data. Know your market rate, have your wins documented, and if you can get a competing offer even better. What role is the conversation for?',
        sent_at: '2026-07-18T18:15:00Z',
        is_sent: true,
      },
      {
        id: '1-3',
        content: 'Senior Director at a Series B startup. The base they offered is 15% below what I was making.',
        sent_at: '2026-07-18T18:20:00Z',
        is_sent: false,
      },
      {
        id: '1-4',
        content: 'That gap is very negotiable at a Series B. They have flexibility. Use this script: "I\'m really excited about this role. Based on my research and experience, I was hoping we could get to [X]. Is there flexibility there?" Then stop talking. Let them respond.',
        sent_at: '2026-07-18T18:35:00Z',
        is_sent: true,
      },
      {
        id: '1-5',
        content: 'That negotiation script you shared worked perfectly. I got the offer!',
        sent_at: '2026-07-18T20:30:00Z',
        is_sent: false,
      },
    ],
  },
  {
    id: '2',
    participant_name: 'Priya Sharma',
    participant_role: 'Senior Product Manager',
    participant_company: 'Stripe',
    participant_initials: 'PS',
    participant_avatar_color: '#7B2D8B',
    last_message: 'Would love to grab coffee and hear more about your journey into PM.',
    last_message_at: '2026-07-18T15:00:00Z',
    unread_count: 0,
    messages: [
      {
        id: '2-1',
        content: 'I read your post about transitioning from engineering to PM. I\'m considering the same move and would love to connect.',
        sent_at: '2026-07-18T14:00:00Z',
        is_sent: false,
      },
      {
        id: '2-2',
        content: 'Happy to share! It was one of the best decisions I made. The technical background is actually a huge advantage in PM roles.',
        sent_at: '2026-07-18T14:30:00Z',
        is_sent: true,
      },
      {
        id: '2-3',
        content: 'Would love to grab coffee and hear more about your journey into PM.',
        sent_at: '2026-07-18T15:00:00Z',
        is_sent: false,
      },
    ],
  },
  {
    id: '3',
    participant_name: 'Amara Okafor',
    participant_role: 'Engineering Manager',
    participant_company: 'Notion',
    participant_initials: 'AO',
    participant_avatar_color: '#1A6B3C',
    last_message: 'The Circle meeting is Thursday at 7pm PT. See you there!',
    last_message_at: '2026-07-17T10:00:00Z',
    unread_count: 1,
    messages: [
      {
        id: '3-1',
        content: 'Hey! I\'m leading the Women in Tech Circle and saw you joined. Would you be interested in speaking at our next session about design systems?',
        sent_at: '2026-07-17T09:00:00Z',
        is_sent: false,
      },
      {
        id: '3-2',
        content: 'I\'d love that. What topics are most useful for the group right now?',
        sent_at: '2026-07-17T09:30:00Z',
        is_sent: true,
      },
      {
        id: '3-3',
        content: 'The Circle meeting is Thursday at 7pm PT. See you there!',
        sent_at: '2026-07-17T10:00:00Z',
        is_sent: false,
      },
    ],
  },
]