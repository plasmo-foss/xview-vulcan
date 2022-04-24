import type { NextApiRequest, NextApiResponse } from "next"

type Data = {
  email: string
}

const serverEndpoint = ""

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method !== "POST") {
    res.status(404).end()
    return
  }

  const { coordinates } = req.body

  const result = await fetch("", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      coordinates
    })
  })

  res.status(result.status === 200 ? 200 : 400).end()
}
