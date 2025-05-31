import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/serverSupabase";

export async function GET(request: NextRequest) {
    if (request.method !== 'GET') {
        return NextResponse.json({ message: 'Method not allowed' }, { status: 405 })
    }

    const supabase = await createClient();

    try {
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
        }

        const { data: boards, error } = await supabase.from('boards').select('*').eq('user_id', user.id);

        if (error) {
            return NextResponse.json({ message: error.message }, { status: 500 })
        }

        return NextResponse.json({ boards }, { status: 200 })

    } catch (error) {
        console.error('Error fetching boards:', error)
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
    }
}
