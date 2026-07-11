import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE, verifyToken } from "@/lib/session-token";

// Next.js 16: Middleware is now "Proxy". This runs on the Edge runtime and only
// does an optimistic auth check — real authorization lives in requireAdmin().
export async function proxy(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const session = token ? await verifyToken(token) : null;
  const { pathname } = request.nextUrl;

  // On the login page: if already signed in (not logged out), go to /admin.
  if (pathname === "/login") {
    if (session) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    return NextResponse.next();
  }

  // Everything else matched here is /admin(/*): require a valid session.
  if (!session) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*", "/login"],
};
