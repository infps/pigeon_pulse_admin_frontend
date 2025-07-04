import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { authClient } from "./lib/auth-client";

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  const publicPaths = ["/login"];
  const isPublicPath = publicPaths.some((publicPath) =>
    path.startsWith(publicPath)
  );

  const session = await authClient.getSession({
    fetchOptions: {
      headers: request.headers,
    },
  });
  console.log("Session in middleware:", session);

  if (isPublicPath && !session.data) {
    return NextResponse.next();
  }
  if (isPublicPath && session.data) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (!session.data) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
