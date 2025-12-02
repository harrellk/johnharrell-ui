import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function middleware(req: any) {
  let res = NextResponse.next({
    request: {
      headers: req.headers,
    },
  });

  const supabase = createServerClient(
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
          return req.cookies.getAll().map(c => ({
            name: c.name,
            value: c.value,
          }));
        },
        setAll(cookies: { name: string; value: string }[]) {
          cookies.forEach(({ name, value }) => {
            res.cookies.set(name, value);
          });
        },
      }
    }
  );

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const url = req.nextUrl.clone();

  if (!session && !url.pathname.startsWith("/login")) {
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  return res;
}

export const config = {
  matcher: [
    "/football/:path*",
    "/basketball/:path*",
    "/dashboard/:path*",
    "/test/:path*",
  ],
};

