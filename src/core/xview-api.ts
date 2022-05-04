export enum ApiMethod {
  GET = "GET",
  POST = "POST",
  PUT = "PUT"
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

export const xviewApiSet = new Set(Object.keys(xviewApiMap))

export const callXViewApi = (
  path: XViewApiPath,
  payload?: Record<string, string | number | boolean>,
  initOveride = {} as RequestInit
) =>
  fetch(`/api/xview${path}`, {
    method: xviewApiMap[path],
    ...(payload && { body: JSON.stringify(payload) }),
    ...initOveride
  })
