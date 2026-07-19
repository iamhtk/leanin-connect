import Anthropic from '@anthropic-ai/sdk'
import { NextResponse } from 'next/server'

export async function POST() {
  try {
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
    const message = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 400,
      system:
        'You are a profile optimization coach for Lean In. Be specific and encouraging. Never use em dashes. Return only valid JSON.',
      messages: [
        {
          role: 'user',
          content: `Analyze profile: hasPhoto:false, hasBio:false, hasCircles:false, posts:1, connections:0

Return: {"score":35,"suggestions":[{"title":"short action","description":"one sentence why","impact":"e.g. 3x more requests","action":"button label"},{"title":"...","description":"...","impact":"...","action":"..."},{"title":"...","description":"...","impact":"...","action":"..."}]}`,
        },
      ],
    })

    const text = message.content[0].type === 'text' ? message.content[0].text : ''
    const cleaned = text.replace(/```json|```/g, '').trim()
    const parsed = JSON.parse(cleaned) as {
      score: number
      suggestions: Array<{
        title: string
        description: string
        impact: string
        action: string
      }>
    }
    return NextResponse.json({ data: parsed })
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
