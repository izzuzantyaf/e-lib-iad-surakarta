"use client";

import { createBrowserClient } from "@supabase/ssr";

/**
 * Client-side Supabase client for use in Client Components
 * This is a singleton instance that can be reused across components
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

