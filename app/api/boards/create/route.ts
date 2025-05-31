import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/serverSupabase'

export async function POST(req: NextRequest) {
    const supabase = await createClient()

    try {
        const { data: { user }, error: authError } = await supabase.auth.getUser()

        if (authError || !user) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
        }

        const { name, description, color } = await req.json();

        const boardFile = {
            name: name,
            description: description || '',
            color: color || 'black',
            is_default: false,
            user_id: user.id,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        }

        const { data: boardData, error: boardError } = await supabase.from('boards')
            .insert(boardFile)
            .select()

        if (boardError) {
            return NextResponse.json({ message: boardError.message }, { status: 500 })
        }

        console.log(boardData)

        return NextResponse.json({ board: boardData }, { status: 200 })

    } catch (error) {
        console.error('Error creating board:', error)
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
    }
}

