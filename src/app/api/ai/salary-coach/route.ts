import Anthropic from '@anthropic-ai/sdk'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      role?: string
      company?: string
      salaryRange?: string
      jobType?: string
    }

    const MAX_INPUT = 2000
    const inputs = Object.values(body).filter((v): v is string => typeof v === 'string')
    if (inputs.some((v) => v.length > MAX_INPUT)) {
      return NextResponse.json({ error: 'Input too long' }, { status: 400 })
    }

    const { role, company, salaryRange, jobType } = body
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

    const message = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 300,
      system:
        'You are a salary negotiation coach for Lean In. Be warm and specific. Never use em dashes. Return only valid JSON.',
      messages: [
        {
          role: 'user',
          content: `Negotiation tips for: ${role} at ${company}, ${salaryRange}, ${jobType}. Candidate: Design Engineer 5yr exp SF.
Return: {"tips":["tip under 25 words","tip under 25 words","tip under 25 words"]}`,
        },
      ],
    })

    const text = message.content[0].type === 'text' ? message.content[0].text : ''
    const cleaned = text.replace(/```json|```/g, '').trim()
    const parsed = JSON.parse(cleaned) as { tips: string[] }
    return NextResponse.json({ data: parsed.tips })
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
