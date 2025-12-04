import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function middleware(req: any) {
  const url = new URL(req.url);
  const pathname = url.pathname;

  // 1️⃣ Skip middleware entirely for callback route
  if (pathname.startsWith("/auth/callback")) {
    return NextResponse.next();
  }

  // 2️⃣ Define public routes
  const isPublic = pathname.startsWith("/login");

  // Create Edge-safe Supabase client
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false } }
  );

  // Restore session from cookie
  const access_token = req.cookies.get("sb-access-token")?.value ?? null;

  if (access_token) {
    await supabase.auth.setSession({
      access_token,
      refresh_token: access_token,
    });
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 3️⃣ If logged in & visiting /login → redirect to homepage
  if (user && isPublic) {
    return NextResponse.redirect(`${url.origin}/`);
  }

  // 4️⃣ If NOT logged in & visiting a protected route
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
