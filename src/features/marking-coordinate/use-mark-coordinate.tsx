import { Layer as GenericLayer, Position } from "@deck.gl/core"
import { DataSet } from "@deck.gl/core/lib/layer"
import { LineLayer, PickInfo } from "deck.gl"
import { createProvider } from "puro"
import { useContext, useEffect, useMemo, useState } from "react"


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
  }

  const sendCoordinate = async () => {
    await fetch("/api/send-coord", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        startPos,
        endPos
      })
    })

    setHasBoundary(false)
    setStartPos(undefined)
    setEndPos(undefined)
    setLineLayer(null)

    alert("Coordinate queued for AI Assessment")
  }

  useEffect(() => {
    if (!startPos || !endPos) {
      return
    }

    const [startLon, startLat] = startPos

    const [endLon, endLat] = endPos

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
  }, [startPos, endPos])

  return {
    sendCoordinate,
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

const { BaseContext, Provider } = createProvider(useMarkCoordinateProvider)

export const MarkCoordinateProvider = Provider

export const useMarkCoordinate = () => useContext(BaseContext)
