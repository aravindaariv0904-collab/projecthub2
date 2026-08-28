import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://placeholder-project.supabase.co";
const supabasePublishableKey =
    import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.placeholder";

export const isSupabaseConfigured = Boolean(
    import.meta.env.VITE_SUPABASE_URL &&
    import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY &&
    !import.meta.env.VITE_SUPABASE_URL.includes("placeholder-project") &&
    import.meta.env.VITE_SUPABASE_URL.startsWith("http")
);

if (!isSupabaseConfigured) {
    console.warn("[ProjectHub] Supabase is not configured or using placeholders. Running in offline/mock fallback mode.");
}

export const supabase = createClient(
    supabaseUrl,
    supabasePublishableKey
);