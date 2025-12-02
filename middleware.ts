// middleware.ts
import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function middleware(req: Request) {
  const url = new URL(req.url);
  const cookieStore = cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          cookieStore.set(name, value, options);
        },
        remove(name: string, options: any) {
          cookieStore.set(name, "", { ...options, maxAge: 0 });
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Public routes (allowed without login)
  const isPublic =
    url.pathname.startsWith("/login") ||
    url.pathname.startsWith("/auth/callback");

  // 🚨 If NOT logged-in AND NOT on public route → redirect to login
  if (!user && !isPublic) {
    return NextResponse.redirect(
      `${url.origin}/login?redirectedFrom=${url.pathname}`
    );
  }

  // Otherwise allow access
  return NextResponse.next();
}

// Apply middleware to all non-static routes
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
