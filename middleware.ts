import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("wash24")?.value;
  const isLoginPage = request.nextUrl.pathname === "/auth/login";

  if (!token && !isLoginPage) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  if (token && isLoginPage) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
