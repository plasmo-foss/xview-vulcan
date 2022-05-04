import qs from "query-string"

export enum ApiMethod {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE"
}

const xviewApiMap = {
  "/fetch-coordinates": ApiMethod.GET,
  "/job-status": ApiMethod.GET,
  "/fetch-osm-polygons": ApiMethod.GET,

  "/send-coordinates": ApiMethod.POST,
  "/search-osm-polygons": ApiMethod.POST,
  "/fetch-planet-imagery": ApiMethod.POST,
  "/launch-assessment": ApiMethod.POST
}

type XViewApiPath = keyof typeof xviewApiMap

export type XViewTileSet = {
  timestamp: string
  item_type: string
  item_id: string
}

export type XViewApiFetchPlanetImageryResponse = {
  uid: string
  images: Array<XViewTileSet>
}

export const xviewApiSet = new Set(Object.keys(xviewApiMap))

export const callXViewApi = <T>(
  path: XViewApiPath,
  payload?: Record<string, string | number | boolean | object>,
  initOveride = {} as RequestInit
) => {
  const method = xviewApiMap[path]
  switch (method) {
    case ApiMethod.POST:
    case ApiMethod.PUT:
      return fetch(`/api/xview${path}`, {
        method: xviewApiMap[path],
        ...(payload && { body: JSON.stringify(payload) }),
        ...initOveride
      })
    default:
      return fetch(`/api/xview${path}?${qs.stringify(payload)}`, {
        method: xviewApiMap[path],
        ...initOveride
      })
  }
}
