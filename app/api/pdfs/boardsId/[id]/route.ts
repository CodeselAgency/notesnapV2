import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/serverSupabase";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const supabase = await createClient();

        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = params;

        if (!id) {
            return NextResponse.json({ error: "Board ID is required" }, { status: 400 });
        }

        const { data: pdfs, error: pdfsError } = await supabase
            .from("pdfs")
            .select("*")
            .eq("board_id", id)
            .eq("user_id", user.id); // Ensure user can only see their own PDFs

        if (pdfsError) {
            console.error('Database error:', pdfsError);
            return NextResponse.json({ error: pdfsError.message }, { status: 500 });
        }
        console.log('PDFs:', pdfs);
        // Always return an array, even if empty
        return NextResponse.json(pdfs || []);

    } catch (error) {
        console.error('API error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}