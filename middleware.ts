import { NextResponse } from "next/server";

export function middleware(req: Request) {
  const url = new URL(req.url);

  // Basic Auth
  const basicAuth = req.headers.get("authorization");

  if (!basicAuth) {
    return new NextResponse("Authentication required", {
      status: 401,
      headers: { "WWW-Authenticate": 'Basic realm="Dev Area"' },
    });
  }

  const authValue = basicAuth.split(" ")[1] ?? "";
  const [user, pwd] = Buffer.from(authValue, "base64").toString().split(":");

  if (
    user !== process.env.DEV_USERNAME ||
    pwd !== process.env.DEV_PASSWORD
  ) {
    return new NextResponse("Invalid credentials", {
      status: 401,
      headers: { "WWW-Authenticate": 'Basic realm="Dev Area"' },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$).*)",
  ],
};
