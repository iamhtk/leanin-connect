import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'

export async function GET() {
  try {
    const supabase = await createServerSupabaseClient()
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ data })
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
      content,
      topic_tag,
    } = body

    const { data, error } = await supabaseServer
      .from('posts')
      .insert({
        author_name,
        author_role,
        author_company,
        author_initials,
        author_avatar_color,
        content,
        topic_tag,
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
