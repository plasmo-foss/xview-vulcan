import type { NextApiRequest, NextApiResponse } from "next"
import { Middleware, NextConnect } from "next-connect"

const allowOriginSet = new Set([
  "https://www.nowarpls.org",
  "https://nowarpls.org",
  "https://no-war-pls.vercel.app",
  "http://localhost:1986"
])

export type ApiHandler<T = any> = NextConnect<
  NextApiRequest,
  NextApiResponse<T>
>

type MiddlewareHandler<T = any> = Middleware<NextApiRequest, NextApiResponse<T>>

export const checkOrigin: MiddlewareHandler = (req, res, next) => {
  if (!allowOriginSet.has(req.headers.origin)) {
    return res.status(403).end()
  }

  next()
}
