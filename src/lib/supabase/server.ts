// Cliente de Supabase para Server Components, Route Handlers y Server Actions.
// Mantiene la sesión vía cookies. Next.js 16 → cookies() es async.

import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

export async function createClient() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            for (const { name, value, options } of cookiesToSet) {
              cookieStore.set(name, value, options);
            }
          } catch {
            // Server Components no pueden escribir cookies; ignorar.
            // Las acciones de mutación deben usar un Route Handler o Action propia.
          }
        },
      },
    },
  );
}