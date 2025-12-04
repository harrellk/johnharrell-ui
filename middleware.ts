import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function middleware(req: any) {
  const url = new URL(req.url);
  const pathname = url.pathname;

  const isPublic =
    pathname.startsWith("/login") ||
    pathname.startsWith("/auth/callback");

  // Create Edge-safe Supabase client
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: { persistSession: false },
    }
  );

  // Restore auth session token from cookies manually
  const token = req.cookies.get("sb-access-token")?.value;

  if (token) {
    await supabase.auth.setSession({
      access_token: token,
      refresh_token: token,
    });
  }

  const { data } = await supabase.auth.getUser();
  const user = data?.user ?? null;

  if (!user && !isPublic) {
    return NextResponse.redirect(
      `${url.origin}/login?redirectedFrom=${pathname}`
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$).*)",
  ],
};
