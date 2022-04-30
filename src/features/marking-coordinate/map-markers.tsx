import { AddPinAlt, MinusPinAlt } from "iconoir-react"
import { Marker } from "react-map-gl"

import { useMarkCoordinate } from "./use-mark-coordinate"

export const StartAndEndMarkers = () => {
  const { startPos, endPos } = useMarkCoordinate()
  return (
    <>
      {startPos && (
        <Marker longitude={startPos[0]} latitude={startPos[1]} anchor="bottom">
          <AddPinAlt />
        </Marker>
      )}
      {endPos && (
        <Marker longitude={endPos[0]} latitude={endPos[1]} anchor="top-left">
          <MinusPinAlt />
        </Marker>
      )}
    </>
  )
}
