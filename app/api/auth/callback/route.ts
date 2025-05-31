import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/serverSupabase'

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')

    if (code) {
        const supabase = await createClient()
        const { error } = await supabase.auth.exchangeCodeForSession(code)

        if (error) {
            return NextResponse.redirect(
                new URL(`/signin?error=${encodeURIComponent(error.message)}`, request.url)
            )
        }
    }

    return NextResponse.redirect(new URL('/dashboard', request.url))
}