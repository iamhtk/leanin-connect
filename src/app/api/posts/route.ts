import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '10', 10)
    const cursor = searchParams.get('cursor')
    const tag = searchParams.get('tag')

    let query = supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit + 1)

    if (cursor) {
      query = query.lt('created_at', cursor)
    }

    if (tag && tag !== 'all' && tag !== 'All') {
      query = query.eq('topic_tag', tag)
    }

    const { data, error } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const rows = data ?? []
    const hasMore = rows.length > limit
    const posts = hasMore ? rows.slice(0, limit) : rows
    const nextCursor = hasMore ? posts[posts.length - 1]?.created_at ?? null : null

    return NextResponse.json({
      data: posts,
      nextCursor,
      hasMore,
    })
  } catch {
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabaseServer = await createServerSupabaseClient()
    const {
      data: { user },
    } = await supabaseServer.auth.getUser()

    const body = await request.json()
    const {
      author_name,
      author_role,
      author_company,
      author_initials,
      author_avatar_color,
      topic_tag,
    } = body

    const MAX_CONTENT_LENGTH = 5000
    const ALLOWED_TAGS_RE = /<(?!\/?(?:p|br|strong|em|b|i|ul|ol|li|hr)[\s>/])[a-z]/i

    if (!body.content || typeof body.content !== 'string') {
      return NextResponse.json(
        { error: 'Content is required' },
        { status: 400 }
      )
    }

    if (body.content.trim().length === 0) {
      return NextResponse.json(
        { error: 'Content cannot be empty' },
        { status: 400 }
      )
    }

    if (body.content.length > MAX_CONTENT_LENGTH) {
      return NextResponse.json(
        { error: 'Content too long' },
        { status: 400 }
      )
    }

    // Strip dangerous HTML server-side before storing
    const cleanContent = body.content
      .replace(/<script[\s\S]*?<\/script>/gi, '')
      .replace(/<iframe[\s\S]*?<\/iframe>/gi, '')
      .replace(/<object[\s\S]*?<\/object>/gi, '')
      .replace(/\bon\w+\s*=\s*(['"])[^'"]*\1/gi, '')
      .replace(/\bon\w+\s*=\s*[^\s>]*/gi, '')
      .replace(/javascript\s*:/gi, '')
      .replace(/data\s*:/gi, '')
      // Neutralize remaining disallowed opening tags
      .replace(ALLOWED_TAGS_RE, '')

    const VALID_TAGS = [
      'Negotiation',
      'Promotions',
      'Bias at Work',
      'Work-Life Balance',
      'Career Pivots',
      'Mentorship',
      'Leadership',
      'Early Career',
    ]

    const sanitizedTag = VALID_TAGS.includes(topic_tag)
      ? topic_tag
      : 'General'

    const { data, error } = await supabaseServer
      .from('posts')
      .insert({
        author_name,
        author_role,
        author_company,
        author_initials,
        author_avatar_color,
        content: cleanContent,
        topic_tag: sanitizedTag,
        likes_count: 0,
        replies_count: 0,
        user_id: user?.id || null,
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ data })
  } catch {
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 })
  }
}
