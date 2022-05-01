import nextConnect from "next-connect"

import { ApiHandler, checkOrigin } from "./_common"

const handler: ApiHandler = nextConnect().use(checkOrigin)

handler.get(async (req, res) => {
  // const { startPos, endPos } = req.body
  // const result = await fetch(serverEndpoint, {
  //   method: "POST",
  //   headers: {
  //     "Content-Type": "application/json"
  //   },
  //   body: JSON.stringify({
  //     start_lon: startPos[0],
  //     start_lat: startPos[1],
  //     end_lon: endPos[0],
  //     end_lat: endPos[1]
  //   })
  // })
})

export default handler
