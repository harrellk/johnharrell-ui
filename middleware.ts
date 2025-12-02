import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function middleware(req: any) {
  const url = new URL(req.url);
  const pathname = url.pathname;

  // PUBLIC ROUTES — allowed without auth
  const isPublic =
    pathname.startsWith("/login") ||
    pathname.startsWith("/auth/callback");

  if (isPublic) {
    return NextResponse.next();
  }

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

  // ❌ No user -> redirect to login
  if (!user) {
    return NextResponse.redirect(
      `${url.origin}/login?redirectedFrom=${pathname}`
    );
  }

  return NextResponse.next();
}

// Middleware should NOT run on static assets
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$).*)",
  ],
};
