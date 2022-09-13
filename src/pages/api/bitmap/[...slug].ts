import type { NextRequest } from "next/server"

export const config = {
  runtime: "experimental-edge"
}

const getBitmappoint = ({
  height = "1024",
  width = "1024",
  featureId = "1909c44ae847bf325bf52d1fca64bf01",
  bbox = "37.51020018450526,47.08527907153582,37.5749877963723,47.116955584472436"
} = {}) =>
  `https://evwhs.digitalglobe.com/mapservice/wmsaccess?SERVICE=WMS&REQUEST=GetMap&VERSION=1.1.1&LAYERS=DigitalGlobe:Imagery&FORMAT=image/png&HEIGHT=${height}&WIDTH=${width}&CONNECTID=${process.env.MAXAR_API_KEY}&FEATUREPROFILE=Default_Profile&COVERAGE_CQL_FILTER=featureId=%27${featureId}%27&CRS=EPSG:4326&BBOX=${bbox}`

const handler = async (req: NextRequest) => {
  const [featureId, height, width, bbox] = req.nextUrl.pathname
    .split("/")
    .splice(3)

  const bitmapEndpoint = getBitmappoint({
    height,
    width,
    featureId,
    bbox
  })

  return fetch(bitmapEndpoint)
}

export default handler
