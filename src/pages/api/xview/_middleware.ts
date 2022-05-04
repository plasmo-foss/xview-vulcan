import type { NextRequest } from "next/server"

import { ApiMethod, xviewApiSet } from "~core/xview-api"

const middleware = async (req: NextRequest) => {
  const [apiPath] = req.nextUrl.pathname.split("/").splice(3)

  if (!xviewApiSet.has(`/${apiPath}`)) {
    return new Response("API not found", {
      status: 404
    })
  }

  const init: RequestInit = {
    method: req.method,
    headers: {
      "Content-Type": "application/json",
      "Access-Key": process.env.AI_INTERNAL_API_KEY
    }
  }

  if (req.method !== ApiMethod.GET) {
    init.body = await streamToString(req.body)
  }

  return fetch(`${process.env.AI_INTERNAL_ENDPOINT}/${apiPath}`, init)
}

// https://stackoverflow.com/a/63361543/3151192
async function streamToString(stream: ReadableStream<Uint8Array>) {
  // lets have a ReadableStream as a stream variable
  const chunks = []

  for await (const chunk of stream as any) {
    chunks.push(Buffer.from(chunk))
  }

  return Buffer.concat(chunks).toString("utf-8")
}

export default middleware
