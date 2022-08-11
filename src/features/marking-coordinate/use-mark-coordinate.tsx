import { Layer as GenericLayer, Position } from "@deck.gl/core"
import { DataSet } from "@deck.gl/core/lib/layer"
import { IconLayer, LineLayer, PolygonLayer, PickInfo } from "deck.gl"
import startMarkerSvg from "iconoir/icons/add-pin-alt.svg"
import endMarkerSvg from "iconoir/icons/minus-pin-alt.svg"
import { createProvider } from "puro"
import { useContext, useEffect, useState } from "react"

const svgToDataURL = (svg: string) =>
  `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`

let marker_counter = 0;

const createMarker = (
  svg: {
    src: string
    width: number
    height: number
  },
  position: Position,
) => {
  const data = fetch(svg.src)
    .then((resp) => resp.text())
    .then((d) => [svgToDataURL(d)])
  return new IconLayer<any>({
    id: `${svg.src}-${marker_counter++}`,
    data,
    getIcon: (d) => ({
      url: d,
      width: svg.width,
      height: svg.height,
      mask: true,
      anchorX: svg === startMarkerSvg ? 12 : -6,
      anchorY: 24
    }),
    getColor: d => [0, 140, 255],
    getSize: 24,
    getPosition: () => position
  })
}

const useMarkCoordinateProvider = () => {
  const [startPos, setStartPos] = useState<Position>()
  const [endPos, setEndPos] = useState<Position>()

  const [polygons, setPolygons] = useState([[]])
  const [markers, setMarkers] = useState([])
  const [WIPlines, setWIPlines] = useState([])

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
    setPolygons([[]])
    setMarkers([])
    setWIPlines([])
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

    /*
    const [first] = polygons;
    first.push(e.coordinate);
    setPolygons([first]);
    */

    setWIPlines([...WIPlines, e.coordinate]);
    if (!markers.length) {
      setMarkers([...markers, createMarker(startMarkerSvg, e.coordinate)]);
    }

    if (!!startPos) {
      setEndPos(e.coordinate)
      setEndMarkerLayer(createMarker(endMarkerSvg, e.coordinate))
      // setGettingCoordinate(false)
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
        data: Array(WIPlines.length - 1).fill(0).map((_, index) => {
          const from_coords = WIPlines[index];
          const to_coords = WIPlines[index+1];

          return {
            inbound: 72633,
            outbound: 74735,
            from: {
              coordinates: from_coords,
            },
            to: {
              coordinates: to_coords,
            },
          };
        }),
        pickable: true,
        getWidth: 2,
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
      // setHasBoundary(true)
    }
  }, [startPos, endPos, polygons, WIPlines, markers, cursorPos, hasBoundary])

  return {
    hasBoundary,
    toggleGettingCoordinate,
    toggleMarker,
    setCursorPos,
    // layers: [lineLayer, WIPlineLayer, polygonLayer, startMarkerLayer, endMarkerLayer, ...markers],
    layers: [WIPlineLayer, ...markers],
    cursorPos,
    endPos,
    startPos,
    polygons,
    WIPlines,
    markers,
    gettingCoordinate
  }
}

const { BaseContext, Provider } = createProvider(useMarkCoordinateProvider)

export const MarkCoordinateProvider = Provider

export const useMarkCoordinate = () => useContext(BaseContext)
