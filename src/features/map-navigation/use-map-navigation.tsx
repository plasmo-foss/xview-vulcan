import { createContext, useContext, useMemo, useState } from "react"

import { latLngRegex } from "./coordinate-input"

const useMapNavigationProvider = () => {
  const [query, setQuery] = useState("")
  const [longitude, setLongitude] = useState(21.09)
  const [latitude, setLatitude] = useState(19.86)
  const [zoom, setZoom] = useState(4)
  const [bearing, setBearing] = useState(0)
  const [pitch, setPitch] = useState(0)

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

type MapNavigationContextProps = ReturnType<typeof useMapNavigationProvider>

const MapNavigationContext = createContext<MapNavigationContextProps>(null)

export const MapNavigationProvider = ({ children = null }) => {
  const provider = useMapNavigationProvider()

  return (
    <MapNavigationContext.Provider value={provider}>
      {children}
    </MapNavigationContext.Provider>
  )
}

export const useMapNavigation = () => useContext(MapNavigationContext)
