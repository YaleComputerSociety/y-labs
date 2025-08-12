import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const validRoutes = ["/", "/about", "/account", "/login", "/login-error", "/unknown"];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isValidRoute = validRoutes.includes(pathname);
  const isApi = pathname.startsWith("/api");
  const isStatic = pathname.startsWith("/_next") || pathname.includes(".");

  if (!isValidRoute && !isApi && !isStatic) {
    const url = req.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
