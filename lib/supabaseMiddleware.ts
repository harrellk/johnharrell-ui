// lib/supabaseMiddleware.ts
import { createServerClient } from "@supabase/ssr";
import type { NextRequest, NextResponse } from "next/server";

export function supabaseMiddlewareClient(
  req: NextRequest,
  res: NextResponse
) {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          res.cookies.set(name, value, options);
        },
        remove(name: string, options: any) {
          res.cookies.set(name, "", { ...options, maxAge: 0 });
        },
        getAll() {
          return req.cookies.getAll().map((c) => ({
            name: c.name,
            value: c.value,
          }));
        },
        setAll(cookies: { name: string; value: string }[]) {
          cookies.forEach(({ name, value }) => {
            res.cookies.set(name, value);
          });
        },
      },
    }
  );
}
