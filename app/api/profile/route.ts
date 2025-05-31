import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/serverSupabase";

export async function GET(req: NextRequest) {

    if (req.method !== 'GET') {
        return NextResponse.json({ message: 'Method not allowed' }, { status: 405 })
    }
    const supabase = await createClient();

    try {
        const { data, error } = await supabase.auth.getUser();
        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        const { data: profile, error: profileError } = await supabase.from('profiles').select('*').eq('id', data.user.id);

        if (profileError) {
            return NextResponse.json({ error: profileError.message }, { status: 500 });
        }

        return NextResponse.json(profile);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

