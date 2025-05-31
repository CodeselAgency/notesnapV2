import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/serverSupabase";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {

    if (request.method !== 'GET') {
        return NextResponse.json({ message: 'Method not allowed' }, { status: 405 })
    }

    try {
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
        }

        const { id } = params;

        const { data: board, error: boardError } = await supabase
            .from('boards')
            .select('*')
            .eq('id', id)
            .eq('user_id', user.id)
            .single();

        if (boardError) {
            return NextResponse.json({ message: boardError.message }, { status: 500 })
        }

        if (!board) {
            return NextResponse.json({ message: 'Board not found' }, { status: 404 })
        }

        return NextResponse.json({ board }, { status: 200 })

    } catch (error) {
        console.error('Error fetching board:', error)
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
    }
}
