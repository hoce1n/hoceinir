import { NextResponse, type NextRequest } from "next/server"
import { SESSION_COOKIE } from "@/lib/auth/constants"

const ADMIN_LOGIN_PATH = "/admin/login"

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (!pathname.startsWith("/admin")) return NextResponse.next()
  if (pathname === ADMIN_LOGIN_PATH) return NextResponse.next()

  if (!request.cookies.has(SESSION_COOKIE)) {
    const url = request.nextUrl.clone()
    url.pathname = ADMIN_LOGIN_PATH
    url.search = ""
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: "/admin/:path*",
}
