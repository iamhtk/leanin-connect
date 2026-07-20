import Anthropic from '@anthropic-ai/sdk'
import { NextResponse } from 'next/server'

export async function POST() {
  try {
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

    const strengthAngles = [
      'Focus on visibility and discoverability.',
      'Focus on credibility and trust signals.',
      'Focus on connection and community building.',
      'Focus on career advancement signals.',
      'Focus on first impressions.',
    ]
    const strengthAngle = strengthAngles[Math.floor(Math.random() * strengthAngles.length)]
    const message = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 400,
      temperature: 1,
      system:
        'You are a profile optimization coach for Lean In. Be specific and encouraging. Never use em dashes. Return only valid JSON. Vary your phrasing, structure, and angle every response. Never repeat the same wording twice.',
      messages: [
        {
          role: 'user',
          content: `Analyze profile: hasPhoto:false, hasBio:false, hasCircles:false, posts:1, connections:0

Return: {"score":35,"suggestions":[{"title":"short action","description":"one sentence why","impact":"e.g. 3x more requests","action":"button label"},{"title":"...","description":"...","impact":"...","action":"..."},{"title":"...","description":"...","impact":"...","action":"..."}]}\nProfile coaching angle: ${strengthAngle}`,
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
