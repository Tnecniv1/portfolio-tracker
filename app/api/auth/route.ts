import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'  // anon client — auth only

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  const { email, password } = await req.json()

  const { data, error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) return NextResponse.json({ error: error.message }, { status: 401 })

  const response = NextResponse.json({ success: true })
  response.cookies.set('sb-auth', data.session?.access_token ?? '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24,
    path: '/',
  })
  return response
}

export async function DELETE() {
  const response = NextResponse.json({ success: true })
  response.cookies.delete('sb-auth')
  return response
}
