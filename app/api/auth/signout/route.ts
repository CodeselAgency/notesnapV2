import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/serverSupabase'

export async function POST() {
    try {
        const supabase = await createClient()

        const { error } = await supabase.auth.signOut()

        if (error) {
            return NextResponse.json({ message: error.message }, { status: 400 })
        }

        return NextResponse.json({ message: 'Signed out successfully' })
    } catch (error) {
        console.error('Sign out error:', error)
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        )
    }
}