import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/serverSupabase'

export async function POST(request: NextRequest) {
    try {
        const { provider } = await request.json()
        
        if (provider !== 'google') {
            return NextResponse.json(
                { message: 'Only Google provider is supported' },
                { status: 400 }
            )
        }

        const supabase = await createClient()
        
        // Get protocol and host dynamically
        const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
        const host = request.headers.get('host') || 'localhost:3000';
        const redirectUrl = `${protocol}://${host}/api/auth/callback`;
        
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: redirectUrl, // Use dynamic URL
            },
        })

        if (error) {
            return NextResponse.json({ message: error.message }, { status: 400 })
        }

        return NextResponse.json({ url: data.url })
    } catch (error) {
        console.error('Sign in error:', error)
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        )
    }
}