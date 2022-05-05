import type { NextRequest } from "next/server"

import { ApiMethod, xviewApiSet } from "~core/xview-api"

const middleware = async (req: NextRequest) => {
  const [apiPath] = req.nextUrl.pathname.split("/").splice(3)

  if (!xviewApiSet.has(`/${apiPath}`)) {
    return new Response("API not found", {
      status: 404
    })
  }

  console.log(`[XVIEW] ${req.method} ${req.url}`)

  const init: RequestInit = {
    method: req.method,
    headers: {
      "Content-Type": "application/json",
      "Access-Key": process.env.AI_INTERNAL_API_KEY
    }
  }

  if (req.method !== ApiMethod.GET) {
    init.body = await req.text()
  }

  console.log(`[XVIEW] `, init.body)

  return fetch(
    `${process.env.AI_INTERNAL_ENDPOINT}/${apiPath}${req.nextUrl.search}`,
    init
  )
}

export default middleware
