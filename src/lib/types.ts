export interface Post {
    id: string
    author_name: string
    author_role: string
    author_company: string
    author_initials: string
    author_avatar_color: string
    content: string
    topic_tag: string
    likes_count: number
    replies_count: number
    created_at: string
  }
  
  export interface Job {
    id: string
    company: string
    company_logo_initials: string
    company_logo_color: string
    company_logo_url?: string
    role: string
    location: string
    job_type: 'Full-time' | 'Remote' | 'Hybrid' | 'Contract'
    category: string
    salary_range: string
    posted_at: string
    description: string
    is_ai_match?: boolean
    match_reason?: string
    url: string
  }
  
  export interface Conversation {
    id: string
    participant_name: string
    participant_role: string
    participant_company: string
    participant_initials: string
    participant_avatar_color: string
    participant_avatar_url?: string
    last_message: string
    last_message_at: string
    unread_count: number
    messages: Message[]
  }
  
  export interface Message {
    id: string
    content: string
    sent_at: string
    is_sent: boolean
  }
  
  export interface CareerPulseCard {
    theme: string
    stat: string
    stat_source: string
    insight: string
    questions: string[]
  }
  
  export interface TopicTag {
    label: string
    value: string
    count?: number
  }
  
  export const TOPIC_TAGS: TopicTag[] = [
    { label: 'All',            value: 'all' },
    { label: 'Negotiation',    value: 'Negotiation' },
    { label: 'Promotions',     value: 'Promotions' },
    { label: 'Bias at Work',   value: 'Bias at Work' },
    { label: 'Work-Life Balance', value: 'Work-Life Balance' },
    { label: 'Career Pivots',  value: 'Career Pivots' },
    { label: 'Mentorship',     value: 'Mentorship' },
    { label: 'Leadership',     value: 'Leadership' },
    { label: 'Early Career',   value: 'Early Career' },
  ]