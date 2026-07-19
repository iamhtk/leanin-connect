import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const roughNotes: string = body.roughNotes ?? ''
    const topic: string = body.topic || 'Career'

    const stream = await client.messages.stream({
      model: 'claude-sonnet-4-6',
      max_tokens: 400,
      system: `You are an AI writing coach for Lean In, helping women find their voice and share their
career experiences with confidence. Your job is to transform rough notes into an authentic,
first-person community post. The post should sound warm, direct, and human.
Never use em dashes. Never sound corporate. Keep it under 280 words.
Write in first person. Start directly with the story or insight, not with "I want to share" or similar openers.`,
      messages: [
        {
          role: 'user',
          content: `Topic: ${topic}

Rough notes from the user: "${roughNotes}"

Transform these into a polished community post for the Lean In platform.
Write it as if the user is speaking directly to other professional women.`,
        },
      ],
    })

    const readableStream = new ReadableStream({
      async start(controller) {
        for await (const chunk of stream) {
          if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
            controller.enqueue(new TextEncoder().encode(chunk.delta.text))
          }
        }
        controller.close()
      },
    })

    return new Response(readableStream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
      },
    })
  } catch {
    return NextResponse.json({ error: 'Failed to generate draft' }, { status: 500 })
  }
}
