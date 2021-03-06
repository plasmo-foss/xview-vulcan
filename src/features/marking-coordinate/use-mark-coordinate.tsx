import { Layer as GenericLayer, Position } from "@deck.gl/core"
import { DataSet } from "@deck.gl/core/lib/layer"
import { IconLayer, LineLayer, PickInfo } from "deck.gl"
import startMarkerSvg from "iconoir/icons/add-pin-alt.svg"
import endMarkerSvg from "iconoir/icons/minus-pin-alt.svg"
import { createProvider } from "puro"
import { useContext, useEffect, useState } from "react"

const svgToDataURL = (svg: string) =>
  `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`

const createMarker = (
  svg: {
    src: string
    width: number
    height: number
  },
  position: Position
) => {
  const data = fetch(svg.src)
    .then((resp) => resp.text())
    .then((d) => [svgToDataURL(d)])
  return new IconLayer<any>({
    id: svg.src,
    data,
    getIcon: (d) => ({
      url: d,
      width: svg.width,
      height: svg.height,
      anchorX: svg === startMarkerSvg ? 12 : -6,
      anchorY: 24
    }),
    getSize: 24,
    getPosition: () => position
  })
}

const useMarkCoordinateProvider = () => {
  const [startPos, setStartPos] = useState<Position>()
  const [endPos, setEndPos] = useState<Position>()

  const [hasBoundary, setHasBoundary] = useState(false)

  const [gettingCoordinate, setGettingCoordinate] = useState(false)

  const [lineLayer, setLineLayer] = useState<GenericLayer<Position> | null>(
    null
  )

  const [startMarkerLayer, setStartMarkerLayer] = useState<IconLayer<any>>(null)
  const [endMarkerLayer, setEndMarkerLayer] = useState<IconLayer<any>>(null)

  const [cursorPos, setCursorPos] = useState<Position>()

  const toggleGettingCoordinate = () => setGettingCoordinate(!gettingCoordinate)

  const reset = () => {
    setHasBoundary(false)
    setStartPos(undefined)
    setEndPos(undefined)
    setLineLayer(null)
    setStartMarkerLayer(null)
    setEndMarkerLayer(null)
  }

  const toggleMarker = (e: PickInfo<any>) => {
    if (!gettingCoordinate) {
      return
    }

    if (!!hasBoundary) {
      reset()
      return
    }

    if (!!startPos) {
      setEndPos(e.coordinate)
      setEndMarkerLayer(createMarker(endMarkerSvg, e.coordinate))
      setGettingCoordinate(false)
      return
    }

    setStartPos(e.coordinate)
    setStartMarkerLayer(createMarker(startMarkerSvg, e.coordinate))
  }

  useEffect(() => {
    if (!startPos || (!endPos && !cursorPos) || hasBoundary) {
      return
    }

    const [startLon, startLat] = startPos

    const [endLon, endLat] = endPos || cursorPos

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

    if (!!startPos && !!endPos) {
      setHasBoundary(true)
    }
  }, [startPos, endPos, cursorPos, hasBoundary])

  return {
    hasBoundary,
    toggleGettingCoordinate,
    toggleMarker,
    setCursorPos,
    layers: [lineLayer, startMarkerLayer, endMarkerLayer],
    cursorPos,
    endPos,
    startPos,
    gettingCoordinate
  }
}

const { BaseContext, Provider } = createProvider(useMarkCoordinateProvider)

export const MarkCoordinateProvider = Provider

export const useMarkCoordinate = () => useContext(BaseContext)
