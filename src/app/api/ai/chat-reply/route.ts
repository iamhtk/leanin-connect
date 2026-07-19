import Anthropic from '@anthropic-ai/sdk'
import { NextRequest, NextResponse } from 'next/server'

interface HistoryMessage {
  is_sent: boolean
  content: string
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      participantName,
      participantRole,
      participantCompany,
      userMessage,
      conversationHistory,
    } = body as {
      participantName: string
      participantRole: string
      participantCompany: string
      userMessage: string
      conversationHistory?: HistoryMessage[]
    }

    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

    const historyMessages = (conversationHistory ?? []).slice(-6).map((msg) => ({
      role: (msg.is_sent ? 'user' : 'assistant') as 'user' | 'assistant',
      content: msg.content,
    }))

    const message = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 200,
      system: `You are ${participantName}, a ${participantRole} at ${participantCompany}. 
You are a professional woman in the Lean In community. 
Reply naturally as yourself in a warm, professional, conversational tone.
Keep replies short — 1 to 3 sentences maximum.
Never break character. Never mention being an AI.
You are genuinely interested in connecting with other professional women.`,
      messages: [...historyMessages, { role: 'user', content: userMessage }],
    })

    const reply = message.content[0].type === 'text' ? message.content[0].text : ''

    return NextResponse.json({ data: reply })
  } catch (error) {
    console.error('Chat reply error:', error)
    return NextResponse.json({ error: 'Failed to generate reply' }, { status: 500 })
  }
}
