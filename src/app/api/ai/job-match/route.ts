import Anthropic from '@anthropic-ai/sdk'
import { NextResponse } from 'next/server'
import { MOCK_JOBS } from '@/data/jobs'

export async function POST() {
  try {
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

    const matchAngles = [
      'Emphasize growth potential and learning opportunities.',
      'Emphasize compensation and career advancement.',
      'Emphasize mission alignment and team culture.',
      'Emphasize technical skill development.',
      'Emphasize work-life balance and flexibility.',
    ]
    const matchAngle = matchAngles[Math.floor(Math.random() * matchAngles.length)]

    const userProfile = {
      name: 'Hrithik Sanyal',
      role: 'Design Engineer',
      industry: 'Technology',
      location: 'San Francisco, CA',
      skills: [
        'React',
        'TypeScript',
        'Design Systems',
        'Figma',
        'Product Design',
        'UI Engineering',
      ],
      experience: '5 years',
    }

    const jobList = MOCK_JOBS.map(
      (job) =>
        `ID:${job.id} | ${job.role} at ${job.company} | ${job.job_type} | ${job.category}`
    ).join('\n')

    const message = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 300,
      temperature: 1,
      system: `You are a career matching AI for Lean In, a platform 
helping women advance their careers. Analyze job listings and match 
them to a candidate profile. Return only valid JSON, nothing else. Vary your phrasing, structure, and angle every response. Never repeat the same wording twice.`,
      messages: [
        {
          role: 'user',
          content: `Candidate profile:
Role: ${userProfile.role}
Industry: ${userProfile.industry}
Location: ${userProfile.location}
Skills: ${userProfile.skills.join(', ')}
Experience: ${userProfile.experience}

Job listings:
${jobList}

Return a JSON object with this exact shape:
{
  "matches": [
    { "id": "job_id", "reason": "one sentence why this matches" },
    { "id": "job_id", "reason": "one sentence why this matches" }
  ]
}

Pick exactly the 2 best matching jobs. Keep each reason under 12 words.\nPerspective for this match: ${matchAngle}`,
        },
      ],
    })

    const text = message.content[0].type === 'text' ? message.content[0].text : ''
    const cleaned = text.replace(/```json|```/g, '').trim()
    const parsed = JSON.parse(cleaned) as { matches: Array<{ id: string; reason: string }> }

    return NextResponse.json({ data: parsed.matches })
  } catch (error) {
    console.error('Job match error:', error)
    return NextResponse.json({ error: 'Failed to match jobs' }, { status: 500 })
  }
}
