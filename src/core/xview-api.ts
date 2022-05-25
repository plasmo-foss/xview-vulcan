import ky, { Options } from "ky"
import qs from "query-string"
import useSWR from "swr"

export enum APIMethod {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE"
}

const xviewAPIMap = {
  "/fetch-coordinates": APIMethod.GET,
  "/job-status": APIMethod.GET,
  "/fetch-osm-polygons": APIMethod.GET,

  "/send-coordinates": APIMethod.POST,
  "/search-osm-polygons": APIMethod.POST,
  "/fetch-planet-imagery": APIMethod.POST,
  "/launch-assessment": APIMethod.POST,
  "/fetch-assessment": APIMethod.POST
}

type XViewAPIPath = keyof typeof xviewAPIMap

export type XViewTileSet = {
  timestamp: string
  item_type: string
  item_id: string
}

export type XViewApiFetchPlanetImageryResponse = {
  uid: string
  images: Array<XViewTileSet>
}

export const xviewApiSet = new Set(Object.keys(xviewAPIMap))

export const callXViewAPI = (
  path: XViewAPIPath,
  payload?: Record<string, string | number | boolean | object>,
  options = {
    retry: {
      limit: 5,
      methods: ["GET", "POST"],
      statusCodes: [408, 500, 502, 503, 504],
      maxRetryAfter: 10000000
    },
    timeout: false
  } as Options
) => {
  const method = xviewAPIMap[path]
  switch (method) {
    case APIMethod.POST:
    case APIMethod.PUT:
      return ky(`/api/xview${path}`, {
        method: xviewAPIMap[path],
        ...(payload && { body: JSON.stringify(payload) }),
        ...options
      })
    default:
      return ky(`/api/xview${path}?${qs.stringify(payload)}`, {
        method: xviewAPIMap[path],
        ...options
      })
  }
}

export const useXViewAPI = <T>(
  path: XViewAPIPath,
  payload?: Record<string, string | number | boolean | object>
) =>
  useSWR<T>(
    !!path ? `/api/xview${path}?${qs.stringify(payload)}` : null,
    (url) => ky.get(url).json()
  )
