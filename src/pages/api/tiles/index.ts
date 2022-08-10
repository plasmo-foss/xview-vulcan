import type { NextRequest } from "next/server"

export const config = {
  runtime: "experimental-edge"
}

const getTileEndpoint = ({
  tileId = "",
  itemType = "",
  itemId = "",
  z = "",
  x = "",
  y = ""
}) =>
  `https://tiles${tileId}.planet.com/data/v1/${itemType}/${itemId}/${z}/${x}/${y}.png?api_key=${process.env.PLANET_API_KEY}`

const handler = async (req: NextRequest) => {
  const [itemType, itemId, tileId, z, x, y] = req.nextUrl.pathname
    .split("/")
    .splice(3)

  const tileEndpoint = getTileEndpoint({
    itemType,
    itemId,
    tileId,
    z,
    x,
    y
  })

  // return fetch(tileEndpoint)

  const imageResp = await fetch(tileEndpoint)

  const blob = await imageResp.blob()

  return new Response(blob, {
    headers: {
      "Content-Type": "image/png",
      "Content-Length": blob.toString()
    }
  })
}

export default handler
