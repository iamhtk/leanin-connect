import Anthropic from '@anthropic-ai/sdk'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { query?: string }

    if (!body.query || typeof body.query !== 'string') {
      return NextResponse.json({ error: 'query is required' }, { status: 400 })
    }

    const MAX_INPUT = 2000
    const inputs = Object.values(body).filter((v): v is string => typeof v === 'string')
    if (inputs.some((v) => v.length > MAX_INPUT)) {
      return NextResponse.json({ error: 'Input too long' }, { status: 400 })
    }

    const { query } = body
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

    const message = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 400,
      temperature: 1,
      system: 'You are the search engine for Lean In Connect. Return only valid JSON. Vary your phrasing, structure, and angle every response. Never repeat the same wording twice. Vary how you describe and summarize results each time.',
      messages: [
        {
          role: 'user',
          content: `Search: "${query}"

Data:
Circles: Women in Finance, The Balance Collective, Leaning into AI, Early-career professionals, The Latina Coalition, Mechanical Engineering Circle Delhi
Members: Priya Sharma-Senior PM-Stripe, Amara Okafor-Engineering Manager-Notion, Sarah Chen-Director Marketing-Figma, Fatima Al-Hassan-UX Research-Airbnb, Maya Rodriguez-Software Engineer-Linear, Jennifer Park-VP Operations-Rippling, Aisha Patel-Head Product-Vercel, Nina Okonkwo-Staff Engineer-Shopify
Resources: Your first Circle meeting, How to negotiate so everyone wins, Make stress work for you, Why stories beat data at work, Negotiation prep template, 5 ways to fight burnout
Topics: Negotiation, Promotions, Bias at Work, Work-Life Balance, Career Pivots, Mentorship, Leadership, Early Career

Return: {"results":{"circles":[],"members":[],"resources":[],"topics":[]},"summary":"one sentence"}`,
        },
      ],
    })

    const text = message.content[0].type === 'text' ? message.content[0].text : ''
    const cleaned = text.replace(/```json|```/g, '').trim()
    const parsed = JSON.parse(cleaned) as {
      results: {
        circles: string[]
        members: string[]
        resources: string[]
        topics: string[]
      }
      summary: string
    }
    return NextResponse.json({ data: parsed })
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
