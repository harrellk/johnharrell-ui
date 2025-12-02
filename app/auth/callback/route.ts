import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(`${url.origin}/login`);
  }

  // Create a redirect response now (so we can set cookies on it)
  let response = NextResponse.redirect(`${url.origin}/dashboard`);

  // Create Supabase client with a COMPLETE cookie implementation
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) {
          return request.headers
            .get("cookie")
            ?.split("; ")
            .find((c) => c.startsWith(`${name}=`))
            ?.split("=")[1];
        },
        set(name, value, options) {
          response.cookies.set(name, value, options);
        },
        remove(name, options) {
          response.cookies.set(name, "", { ...options, maxAge: 0 });
        },
        getAll() {
          const raw = request.headers.get("cookie")?.split("; ") ?? [];
          return raw.map((entry) => {
            const [n, v] = entry.split("=");
            return { name: n, value: v };
          });
        },
        setAll(cookies) {
          for (const { name, value } of cookies) {
            response.cookies.set(name, value);
          }
        },
      },
    }
  );

  // Exchange the magic link code for a session cookie (this is the key!)
  await supabase.auth.exchangeCodeForSession(code);

  // Return the response with session cookie applied
  return response;
}
