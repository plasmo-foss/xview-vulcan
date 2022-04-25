import { createContext, useContext, useMemo, useState } from "react"

const useMapNavigationProvider = () => {
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

  return {
    viewState,
    setLongitude,
    setLatitude,
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
