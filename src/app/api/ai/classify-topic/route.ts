import Anthropic from '@anthropic-ai/sdk'
import { NextRequest, NextResponse } from 'next/server'

const TOPICS = [
  'Negotiation',
  'Promotions',
  'Bias at Work',
  'Work-Life Balance',
  'Career Pivots',
  'Mentorship',
  'Leadership',
  'Early Career',
]

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { content?: unknown }
    const content = typeof body.content === 'string' ? body.content : ''

    if (!content.trim()) {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 })
    }

    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

    const message = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 50,
      temperature: 1,
      system:
        'You classify text into exactly one category. Return only the category name, nothing else.',
      messages: [
        {
          role: 'user',
          content: `Classify this text into exactly one of these categories:
${TOPICS.join(', ')}

Text: "${content.slice(0, 300)}"

Return only the category name from the list above. Nothing else.`,
        },
      ],
    })

    const text =
      message.content[0]?.type === 'text' ? message.content[0].text.trim() : ''

    const matched =
      TOPICS.find((topic) => text.toLowerCase().includes(topic.toLowerCase())) || null

    return NextResponse.json({ data: { topic: matched } })
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
