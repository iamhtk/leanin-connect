import Anthropic from '@anthropic-ai/sdk'
import { NextResponse } from 'next/server'

export async function POST() {
  try {
    const client = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    })

    const recAngles = [
      'Focus on career growth potential of each circle.',
      'Focus on community and belonging.',
      'Focus on skill building and learning.',
      'Focus on networking and connections.',
      'Focus on mentorship opportunities.',
    ]
    const recAngle = recAngles[Math.floor(Math.random() * recAngles.length)]

    const message = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 300,
      temperature: 1,
      system: 'You are a community matching assistant for Lean In. Return only valid JSON. Vary your phrasing, structure, and angle every response. Never repeat the same wording twice.',
      messages: [
        {
          role: 'user',
          content: `Match this user to circles:
User: Design Engineer, 5 years exp, SF, interests: AI, Design Systems, Leadership

Circles available:
ID:1 Women in Finance FINANCE
ID:2 The Balance Collective LEADERSHIP  
ID:3 Leaning into AI TECH
ID:4 Early-career professionals CAREER
ID:5 The Latina Coalition LEADERSHIP
ID:6 Mechanical Engineering Circle Delhi TECH

Return: {"recommendations":[{"id":3,"reason":"under 12 words"},{"id":2,"reason":"under 12 words"},{"id":4,"reason":"under 12 words"}]}\nRecommendation lens: ${recAngle}`,
        },
      ],
    })

    const text = message.content[0].type === 'text' ? message.content[0].text : ''
    const cleaned = text.replace(/```json|```/g, '').trim()
    const parsed = JSON.parse(cleaned) as {
      recommendations: Array<{ id: number; reason: string }>
    }
    return NextResponse.json({ data: parsed.recommendations })
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
