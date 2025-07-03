import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  const publicPaths = ["/login"];
  const isPublicPath = publicPaths.some((publicPath) =>
    path.startsWith(publicPath)
  );

  const sessionToken = request.cookies.get("better-auth.session_token")?.value;

  if (isPublicPath && !sessionToken) {
    return NextResponse.next();
  }
  if (isPublicPath && sessionToken) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (!sessionToken) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
