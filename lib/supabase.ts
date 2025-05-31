import { createClient } from "@supabase/supabase-js";

// Create a single supabase client for server-side usage (API routes, webhooks, server components)
export const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    "https://ouisszmrionudhicfsuc.supabase.co",
    process.env.SUPABASE_SERVICE_ROLE_KEY || "", // Need to use service role key for admin operations
    {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
        },
    }
);