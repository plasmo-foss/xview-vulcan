import { NextRequest, NextResponse } from "next/server"

export const config = {
  matcher: "/"
}

export function middleware(req: NextRequest) {
  const basicAuth = req.headers.get("authorization")

  if (basicAuth) {
    const auth = basicAuth.split(" ")[1]
    const [user, pwd] = atob(auth).split(":")

    if (user === process.env.APP_USERNAME && pwd === process.env.APP_PASSWORD) {
      return NextResponse.next()
    }
  }

  const url = req.nextUrl
  url.pathname = "/api/auth"
  return NextResponse.rewrite(url)
}
