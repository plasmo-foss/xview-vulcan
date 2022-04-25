import { Layer as GenericLayer, Position } from "@deck.gl/core"
import { DataSet } from "@deck.gl/core/lib/layer"
import { LineLayer, PickInfo } from "deck.gl"
import { createContext, useContext, useMemo, useState } from "react"

const useMarkCoordinateProvider = () => {
  const [startPos, setStartPos] = useState<Position>()
  const [endPos, setEndPos] = useState<Position>()

  const [hasBoundary, setHasBoundary] = useState(false)

  const [gettingCoordinate, setGettingCoordinate] = useState(false)

  const [lineLayer, setLineLayer] = useState<GenericLayer<Position> | null>(
    null
  )
  const [cursorPos, setCursorPos] = useState<Position>()

  const readyToSend = useMemo(
    () => !!lineLayer && hasBoundary,
    [lineLayer, hasBoundary]
  )

  const toggleGettingCoordinate = () => setGettingCoordinate(!gettingCoordinate)

  const toggleStart = (e: PickInfo<any>) => {
    if (!gettingCoordinate) {
      return
    }

    if (!!hasBoundary) {
      setHasBoundary(false)
      setStartPos(undefined)
      setEndPos(undefined)
      setLineLayer(null)
      return
    }

    if (!!startPos && !!endPos) {
      setHasBoundary(true)
      setGettingCoordinate(false)
      return
    }

    setStartPos(e.coordinate)
  }

  const traceEnd = (e: PickInfo<any>) => {
    setCursorPos(e.coordinate)
    if (!gettingCoordinate || !startPos || hasBoundary || !e.coordinate) {
      return
    }

    setEndPos(e.coordinate)

    const [startLon, startLat] = startPos

    const [endLon, endLat] = e.coordinate

    setLineLayer(
      new LineLayer({
        id: "selection",
        getWidth: 2,
        data: [
          {
            sourcePosition: [startLon, startLat],
            targetPosition: [endLon, startLat]
          },
          {
            sourcePosition: [endLon, startLat],
            targetPosition: [endLon, endLat]
          },
          {
            sourcePosition: [endLon, endLat],
            targetPosition: [startLon, endLat]
          },
          {
            sourcePosition: [startLon, endLat],
            targetPosition: [startLon, startLat]
          }
        ] as DataSet<Position>
      })
    )
  }

  return {
    toggleGettingCoordinate,
    toggleStart,
    traceEnd,
    lineLayer,
    cursorPos,
    endPos,
    startPos,
    readyToSend,
    gettingCoordinate
  }
}

type MarkCoordinateContextProps = ReturnType<typeof useMarkCoordinateProvider>

const MarkCoordinateContext = createContext<MarkCoordinateContextProps>(null)

export const MarkCoordinateProvider = ({ children = null }) => {
  const provider = useMarkCoordinateProvider()

  return (
    <MarkCoordinateContext.Provider value={provider}>
      {children}
    </MarkCoordinateContext.Provider>
  )
}

export const useMarkCoordinate = () => useContext(MarkCoordinateContext)
