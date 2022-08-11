import { Layer as GenericLayer, Position } from "@deck.gl/core"
import { DataSet } from "@deck.gl/core/lib/layer"
import { IconLayer, LineLayer, PolygonLayer, PickInfo } from "deck.gl"
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
  );

  const [WIPlineLayer, setWIPLineLayer] = useState<GenericLayer<Position> | null>(
    null
  );

  const [polygonLayer, setPolygonLayer] = useState<GenericLayer<Position> | null>(
    null
  );

  const [startMarkerLayer, setStartMarkerLayer] = useState<IconLayer<any>>(null)
  const [endMarkerLayer, setEndMarkerLayer] = useState<IconLayer<any>>(null)

  const [cursorPos, setCursorPos] = useState<Position>()

  const toggleGettingCoordinate = () => setGettingCoordinate(!gettingCoordinate)

  const reset = () => {
    setHasBoundary(false)
    setStartPos(undefined)
    setEndPos(undefined)
    setLineLayer(null)
    setWIPLineLayer(null)
    setPolygonLayer(null)
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

    setWIPLineLayer(
      new LineLayer({
        id: 'line-layer',
        data: [
          {
            inbound: 72633,
            outbound: 74735,
            from: {
              name: '19th St. Oakland (19TH)',
              coordinates: [startLon, startLat],
            },
            to: {
              name: '12th St. Oakland City Center (12TH)',
              coordinates: [endLon, endLat],
            },
          }
        ],
        pickable: true,
        getWidth: 50,
        getSourcePosition: d => d.from.coordinates,
        getTargetPosition: d => d.to.coordinates,
        getColor: d => [Math.sqrt(d.inbound + d.outbound), 140, 0]
      })
    )

    setPolygonLayer(
      new PolygonLayer({
        id: "polygon",
        getWidth: 2,
        data: [
          {
            contour: [[-122.4, 37.7], [-122.4, 37.8], [-122.5, 37.8], [-122.5, 37.7], [-122.4, 37.7]],
            zipcode: 94107,
            population: 26599,
            area: 6.11
          }
        ],
        pickable: true,
        stroked: true,
        filled: true,
        wireframe: true,
        lineWidthMinPixels: 1,
        getPolygon: d => d.contour,
        getElevation: d => d.population / d.area / 10,
        getFillColor: d => [d.population / d.area / 60, 140, 0],
        getLineColor: [80, 80, 80],
        getLineWidth: 1
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
    layers: [lineLayer, WIPlineLayer, polygonLayer, startMarkerLayer, endMarkerLayer],
    cursorPos,
    endPos,
    startPos,
    gettingCoordinate
  }
}

const { BaseContext, Provider } = createProvider(useMarkCoordinateProvider)

export const MarkCoordinateProvider = Provider

export const useMarkCoordinate = () => useContext(BaseContext)
