import { NextRequest, NextResponse } from "next/server"

const publicPathList = ["favicons"]

const publicPathSet = new Set(publicPathList)

export function middleware(req: NextRequest) {
  const pathName = req.nextUrl.pathname.split("/")[1]
  if (publicPathSet.has(pathName)) {
    return NextResponse.next()
  }

  const basicAuth = req.headers.get("authorization")

  if (basicAuth) {
    const auth = basicAuth.split(" ")[1]
    const [user, pwd] = atob(auth).split(":")

    if (user === process.env.APP_USERNAME && pwd === process.env.APP_PASSWORD) {
      return NextResponse.next()
    }
  }

  return new Response("Auth required", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Secure Area"'
    }
  })
}
