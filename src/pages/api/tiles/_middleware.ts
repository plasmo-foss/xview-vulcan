import type { NextRequest } from "next/server"

const getTileEndpoint = ({
  tileId = "",
  itemType = "",
  itemId = "",
  z = "",
  x = "",
  y = ""
}) =>
  `https://tiles${tileId}.planet.com/data/v1/${itemType}/${itemId}/${z}/${x}/${y}.png?api_key=${process.env.PLANET_API_KEY}`

const middleware = (req: NextRequest) => {
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

  return fetch(tileEndpoint)
}

export default middleware
