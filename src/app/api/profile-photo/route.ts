import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const formData = await request.formData()
    const fileEntry = formData.get('file')
    const file = fileEntry instanceof File ? fileEntry : null

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'File must be JPEG, PNG, WebP, or GIF' },
        { status: 400 }
      )
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'File must be under 5MB' }, { status: 400 })
    }

    const ext = file.type.split('/')[1]?.replace('jpeg', 'jpg') || 'jpg'
    const filePath = user.id + '/avatar.' + ext

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, buffer, {
      contentType: file.type,
      upsert: true,
    })

    if (uploadError) throw uploadError

    const {
      data: { publicUrl },
    } = supabase.storage.from('avatars').getPublicUrl(filePath)

    const cacheBustedUrl = publicUrl + '?t=' + Date.now()

    const { error: updateError } = await supabase
      .from('profiles')
      .update({ avatar_url: cacheBustedUrl })
      .eq('id', user.id)

    if (updateError) throw updateError

    return NextResponse.json({ data: { url: cacheBustedUrl } })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Upload failed'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
