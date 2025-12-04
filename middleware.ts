import { NextResponse } from "next/server";
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";

export async function middleware(req: any) {
  const res = NextResponse.next();

  const url = new URL(req.url);
  const pathname = url.pathname;

  // PUBLIC ROUTES — allowed without auth
  const isPublic =
    pathname.startsWith("/login") ||
    pathname.startsWith("/auth/callback");

  // Initialize Supabase client for Edge Middleware
  const supabase = createMiddlewareClient(
    { req, res },
    {
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
      supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    }
  );

  // Get user session
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Redirect if not logged in
  if (!user && !isPublic) {
    return NextResponse.redirect(
      `${url.origin}/login?redirectedFrom=${pathname}`
    );
  }

  return res;
}

// Middleware should NOT run on static assets
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$).*)",
  ],
};
