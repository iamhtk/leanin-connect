import Anthropic from '@anthropic-ai/sdk'
import { NextRequest, NextResponse } from 'next/server'

interface HistoryEntry {
  role: string
  content: string
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { message, history } = body as {
      message: string
      history?: HistoryEntry[]
    }

    const MAX_INPUT = 2000
    const inputs = Object.values(body as Record<string, unknown>).filter(
      (v): v is string => typeof v === 'string'
    )
    if (inputs.some((v) => v.length > MAX_INPUT)) {
      return NextResponse.json({ error: 'Input too long' }, { status: 400 })
    }

    const client = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    })

    const historyMessages = (history || []).map((m) => ({
      role: m.role as 'user' | 'assistant',
      content: m.content,
    }))

    // Anthropic requires the messages array to start with a user turn
    while (historyMessages.length > 0 && historyMessages[0].role === 'assistant') {
      historyMessages.shift()
    }

    const msg = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 300,
      temperature: 1,
      system: `You are the Lean In Connect AI assistant. 
Lean In Connect is a community platform helping women advance 
their careers. You help users navigate the platform, find 
Circles and Networks, discover resources, connect with members,
and learn about upcoming events.

The platform has these sections:
- Home/Feed: community posts filtered by topic
- Circles: small peer groups of 5-8 women who meet monthly
- Networks: larger regional or industry communities
- Groups: public discussion groups on topics like AI, work-life balance
- Directory: searchable member directory
- Jobs/Opportunities: curated roles at women-friendly companies
- Messages: direct messaging with other members
- Events: virtual and in-person events
- Resources: articles, videos, toolkits for leadership development
- Notifications: activity updates

Be warm, direct, and helpful. Keep responses concise — 
2 to 4 sentences. If someone asks about a specific section,
explain what it does and how to find it. Never use em dashes. Vary your tone, phrasing, and response structure every message. Be conversational and never robotic.`,
      messages: [...historyMessages, { role: 'user' as const, content: message }],
    })

    const reply =
      msg.content[0].type === 'text'
        ? msg.content[0].text
        : "I'm here to help! What would you like to know?"

    return NextResponse.json({ data: reply })
  } catch (error) {
    console.error('Assistant error:', error)
    return NextResponse.json({ error: 'Failed to get response' }, { status: 500 })
  }
}
