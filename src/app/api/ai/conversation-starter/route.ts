import Anthropic from '@anthropic-ai/sdk'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { recipientName, recipientRole, recipientCompany } = body as {
      recipientName?: string
      recipientRole?: string
      recipientCompany?: string
    }

    const MAX_INPUT = 2000
    const inputs = Object.values(body as Record<string, unknown>).filter(
      (v): v is string => typeof v === 'string'
    )
    if (inputs.some((v) => v.length > MAX_INPUT)) {
      return NextResponse.json({ error: 'Input too long' }, { status: 400 })
    }

    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

    const starterStyles = [
      'Make the openers curious and question-led.',
      'Make the openers warm and personal.',
      'Make the openers bold and direct.',
      'Make the openers focused on shared experience.',
      'Make the openers witty and light.',
    ]
    const starterStyle = starterStyles[Math.floor(Math.random() * starterStyles.length)]

    const message = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 400,
      temperature: 1,
      system: `You are a community facilitator for Lean In, helping 
women connect with each other professionally. Generate warm, 
authentic conversation starters that feel human and specific, 
not generic. Never use em dashes. Keep each starter under 
25 words. Return only valid JSON. Vary your phrasing, structure, and angle every response. Never repeat the same wording twice.`,
      messages: [
        {
          role: 'user',
          content: `Generate 3 conversation starters for reaching out to:
Name: ${recipientName}
Role: ${recipientRole}
Company: ${recipientCompany}

The sender is Hrithik Sanyal, a Design Engineer at Lean In Connect.

Return exactly this JSON shape:
{
  "starters": [
    "first conversation starter",
    "second conversation starter", 
    "third conversation starter"
  ]
}

Make each starter warm, specific to their role or company, 
and focused on career connection or shared experience.\nStyle for these openers: ${starterStyle}`,
        },
      ],
    })

    const text = message.content[0].type === 'text' ? message.content[0].text : ''
    const cleaned = text.replace(/```json|```/g, '').trim()
    const parsed = JSON.parse(cleaned) as { starters: string[] }

    return NextResponse.json({ data: parsed.starters })
  } catch (error) {
    console.error('Conversation starter error:', error)
    return NextResponse.json({ error: 'Failed to generate starters' }, { status: 500 })
  }
}
