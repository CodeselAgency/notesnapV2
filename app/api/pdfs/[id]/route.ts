import { createClient } from '@/lib/serverSupabase'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    if (req.method !== 'GET') {
        return NextResponse.json({ message: 'Method not allowed' }, { status: 405 })
    }

    try {
        const supabase = await createClient()

        const { data: { user }, error: authError } = await supabase.auth.getUser()

        if (authError || !user) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
        }

        const { id } = params;

        const { data: pdf, error } = await supabase.from('pdfs').select('*').eq('id', id).single()

        if (error) {
            return NextResponse.json({ message: error.message }, { status: 500 })
        }

        if (!pdf) {
            return NextResponse.json({ message: 'PDF not found' }, { status: 404 })
        }

        return NextResponse.json(pdf)

    } catch (error) {
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
    }

}