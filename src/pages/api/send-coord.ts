import nextConnect from "next-connect"

import { ApiHandler, checkOrigin } from "./_common"

const serverEndpoint = `${process.env.AI_INTERNAL_ENDPOINT}/send-coordinates`

const handler: ApiHandler = nextConnect().use(checkOrigin)

handler.post(async (req, res) => {
  const { startPos, endPos } = req.body

  const result = await fetch(serverEndpoint, {
    method: "POST",
    headers: {
      "Access-Key": process.env.AI_INTERNAL_API_KEY,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      start_lon: startPos[0],
      start_lat: startPos[1],
      end_lon: endPos[0],
      end_lat: endPos[1]
    })
  })

  if (result.status !== 200) {
    res.status(result.status).end()
    return
  }

  res.status(200).json({
    jobId: await result.text()
  })
})

export default handler
