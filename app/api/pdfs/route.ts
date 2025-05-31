import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/serverSupabase'

export async function GET(req: NextRequest) {
    if (req.method !== 'GET') {
        return NextResponse.json({ message: 'Method not allowed' }, { status: 405 })
    }

    try {
        const supabase = await createClient()

        const { data: { user }, error: authError } = await supabase.auth.getUser()

        if (authError || !user) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
        }

        const { data: pdfs, error } = await supabase.from('pdfs').select('*').eq('user_id', user.id)

        if (error) {
            return NextResponse.json({ message: error.message }, { status: 500 })
        }

        // console.log(pdfs)

        return NextResponse.json({ pdfs }, { status: 200 })

    } catch (error) {
        console.error('Error fetching PDFs:', error)
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
    }
}