import { createProvider } from "puro"
import { useContext, useEffect, useMemo, useState } from "react"
import { useHashedState } from "use-hashed-state"

import { latLngRegex } from "./coordinate-input"
import { getQueryValueMap, setQueryStringValue } from "./query-string"

const useMapNavigationProvider = () => {
  const [query, setQuery] = useState("")
  const [longitude, setLongitude] = useHashedState("longitude", 21.09)
  const [latitude, setLatitude] = useHashedState("latitude", 19.86)
  const [zoom, setZoom] = useHashedState("zoom", 4)
  const [bearing, setBearing] = useHashedState("bearing", 0)
  const [pitch, setPitch] = useHashedState("pitch", 0)

  const setCoordinate = (
    lat: number,
    lng: number,
    { fixed = false, overideQuery = true } = {}
  ) => {
    if (overideQuery && (query.length === 0 || latLngRegex.test(query))) {
      setQuery(
        fixed ? `${lat.toFixed(6)}, ${lng.toFixed(6)}` : `${lat}, ${lng}`
      )
    }
    setLatitude(lat)
    setLongitude(lng)
  }

  const viewState = useMemo(
    () => ({
      longitude,
      latitude,
      zoom,
      bearing,
      pitch
    }),
    [longitude, latitude, zoom, bearing, pitch]
  )

  useEffect(() => {
    setQueryStringValue("longitude", longitude)
  }, [longitude])

  useEffect(() => {
    setQueryStringValue("latitude", latitude)
  }, [latitude])

  useEffect(() => {
    setQueryStringValue("zoom", zoom)
  }, [zoom])

  useEffect(() => {
    setQueryStringValue("bearing", bearing)
  }, [bearing])

  useEffect(() => {
    setQueryStringValue("pitch", pitch)
  }, [pitch])

  // Initialize values from query strings
  useEffect(() => {
    const queryMap = getQueryValueMap()

    if (queryMap.longitude) {
      setLongitude(parseFloat(queryMap.longitude))
    }

    if (queryMap.latitude) {
      setLatitude(parseFloat(queryMap.latitude))
    }

    if (queryMap.zoom) {
      setZoom(parseFloat(queryMap.zoom))
    }

    if (queryMap.bearing) {
      setBearing(parseFloat(queryMap.bearing))
    }

    if (queryMap.pitch) {
      setPitch(parseFloat(queryMap.pitch))
    }
  }, [setBearing, setLatitude, setLongitude, setPitch, setZoom])

  return {
    viewState,
    query,
    setQuery,
    setCoordinate,
    setZoom,
    setBearing,
    setPitch
  }
}

const { BaseContext, Provider } = createProvider(useMapNavigationProvider)

export const MapNavigationProvider = Provider

export const useMapNavigation = () => useContext(BaseContext)
