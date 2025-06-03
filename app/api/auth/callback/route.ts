import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/serverSupabase'

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')
    const next = searchParams.get('next') ?? '/dashboard'

    if (code) {
        const supabase = await createClient()
        const { error } = await supabase.auth.exchangeCodeForSession(code)

        if (error) {
            console.error('Auth error:', error)
            return NextResponse.redirect(
                new URL(`/signin?error=${encodeURIComponent(error.message)}`, request.url)
            )
        }

        // Verify the session was created successfully
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) {
            return NextResponse.redirect(
                new URL('/signin?error=Session creation failed', request.url)
            )
        }
    }

    // Use the origin from the request to ensure correct domain
    const redirectUrl = new URL(next, request.url)
    return NextResponse.redirect(redirectUrl)
}