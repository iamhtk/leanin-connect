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

    const historyMessages = (conversationHistory || [])
      .filter((msg) => msg.content !== '...')
      .slice(-6)
      .map((msg) => ({
        role: msg.is_sent ? ('user' as const) : ('assistant' as const),
        content: msg.content,
      }))

    // Anthropic requires the messages array to start with a user turn
    while (historyMessages.length > 0 && historyMessages[0].role === 'assistant') {
      historyMessages.shift()
    }

    const message = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 200,
      system: `You are ${participantName}, a ${participantRole} 
at ${participantCompany}. You are a professional woman in the 
Lean In community. Reply naturally as yourself — warm, direct, 
and conversational. Keep replies to 1 to 3 sentences. 
Never break character. Never say you are an AI.`,
      messages: [
        ...historyMessages,
        { role: 'user' as const, content: userMessage },
      ],
    })

    const reply =
      message.content[0].type === 'text'
        ? message.content[0].text
        : 'Thanks for reaching out!'

    return NextResponse.json({ data: reply })
  } catch (error) {
    console.error('Chat reply error:', error)
    return NextResponse.json({ error: 'Failed to generate reply' }, { status: 500 })
  }
}
