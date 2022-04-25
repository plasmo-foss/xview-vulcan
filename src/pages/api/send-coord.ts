import type { NextApiRequest, NextApiResponse } from "next"

type Data = {
  email: string
}

const serverEndpoint = `${process.env.AI_INTERNAL_ENDPOINT}/send-coordinates`

const allowSet = new Set([
  "https://www.nowarpls.org",
  "https://nowarpls.org",
  "https://no-war-pls.vercel.app",
  "http://localhost:1986"
])

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method !== "POST") {
    res.status(404).end()
    return
  }

  if (!allowSet.has(req.headers.origin)) {
    res.status(403).end()
    return
  }

  const { startPos, endPos } = req.body

  const result = await fetch(serverEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      start_lon: startPos[0],
      start_lat: startPos[1],
      end_lon: endPos[0],
      end_lat: endPos[1]
    })
  })

  res.status(result.status === 200 ? 200 : 400).end()
}
