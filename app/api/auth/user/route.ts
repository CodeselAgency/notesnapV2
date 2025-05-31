import { NextResponse } from 'next/server'
import { createClient } from '@/lib/serverSupabase'

export async function GET() {
    try {
        const supabase = await createClient()

        const { data: { user }, error } = await supabase.auth.getUser()

        if (error) {
            return NextResponse.json({ message: error.message }, { status: 401 })
        }

        return NextResponse.json({ user })
    } catch (error) {
        console.error('Get user error:', error)
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        )
    }
}