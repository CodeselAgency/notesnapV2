import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/serverSupabase';

export async function GET(request: NextRequest) {
    if (request.method !== 'GET') {
        return NextResponse.json({ message: 'Method not allowed' }, { status: 405 })
    }

    try {
        const supabase = await createClient();

        // Fetch ALL subscription tiers instead of just 'free'
        const { data: subscriptions, error } = await supabase
            .from('subscription_limits')
            .select('*')
            .order('tier', { ascending: true });

        if (error) {
            return NextResponse.json({ message: error.message }, { status: 500 })
        }

        return NextResponse.json(subscriptions)

    } catch (error) {
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
    }
}