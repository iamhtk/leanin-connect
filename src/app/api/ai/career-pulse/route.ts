import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { RESEARCH_STATS } from '@/data/research-stats'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

function extractText(content: Anthropic.Messages.ContentBlock[]): string {
  const block = content[0]
  return block?.type === 'text' ? block.text : ''
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const tags: string[] = Array.isArray(body.tags) ? body.tags : []

    const themeResponse = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 100,
      system: 'You are an analyst for Lean In, a platform helping women advance their careers.',
      messages: [
        {
          role: 'user',
          content: `These are the most discussed topics in our community right now: ${tags.join(', ')}. What is the single most pressing career theme? Reply with just the theme name, nothing else.`,
        },
      ],
    })
    const theme = extractText(themeResponse.content).trim()

    const matchedStat =
      RESEARCH_STATS.find((stat) => theme.toLowerCase().includes(stat.topic.toLowerCase())) ?? RESEARCH_STATS[0]

    const insightResponse = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 200,
      system:
        'You are a career coach for Lean In. Write warm, direct, empowering content for professional women. Never use em dashes. Keep it under 60 words.',
      messages: [
        {
          role: 'user',
          content: `Write one empowering insight paragraph about this for the Lean In community: "${matchedStat.stat}" - Theme: ${theme}`,
        },
      ],
    })
    const insight = extractText(insightResponse.content).trim()

    const questionsResponse = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 200,
      system:
        'You are a community facilitator for Lean In. Generate thoughtful discussion questions for professional women. Never use em dashes.',
      messages: [
        {
          role: 'user',
          content: `Generate exactly 3 short discussion questions about: ${theme}. Format as a JSON array of strings. Nothing else.`,
        },
      ],
    })
    const rawQuestions = extractText(questionsResponse.content)
      .replace(/```json/g, '')
      .replace(/```/g, '')
      .trim()

    let questions: string[]
    try {
      const parsed: unknown = JSON.parse(rawQuestions)
      questions =
        Array.isArray(parsed) && parsed.every((item): item is string => typeof item === 'string')
          ? parsed
          : matchedStat.questions
    } catch {
      questions = matchedStat.questions
    }

    return NextResponse.json({
      data: {
        theme,
        stat: matchedStat.stat,
        stat_source: matchedStat.source,
        insight,
        questions,
      },
    })
  } catch {
    return NextResponse.json({ error: 'Failed to generate career pulse' }, { status: 500 })
  }
}
