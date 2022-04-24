import { Layer as GenericLayer, Position } from "@deck.gl/core"
import { ExtentsLeftBottomRightTop } from "@deck.gl/core/utils/positions"
import { LineLayer, SolidPolygonLayer } from "@deck.gl/layers"
import DeckGL from "@deck.gl/react"
import { useTheme } from "@emotion/react"
import { Svg3DRectThreePts, TriangleFlagFull } from "iconoir-react"
import type { NextPage } from "next"
import { useMemo, useState } from "react"
import { Map } from "react-map-gl"

import {
  GetCoordinateButton,
  SendCoordinateButton
} from "~components/get-coordnate-button"
import { MainContainer } from "~components/main-container"

const INITIAL_VIEW_STATE = {
  longitude: -122.41669,
  latitude: 37.7853,
  zoom: 8,
  pitch: 0,
  bearing: 0
}

const IndexPage: NextPage = () => {
  const theme = useTheme()

  const [lineLayer, setLineLayer] = useState<GenericLayer<Position> | null>(
    null
  )

  const [polygonLayer, setPolygonLayer] = useState<SolidPolygonLayer<any>>(null)

  const [staticLayers, setStaticLayers] = useState<
    Array<GenericLayer<any, any>>
  >([])
  const [leftTop, setLeftTop] = useState<Position>()
  const [rightBottom, setRightBottom] = useState<Position>()

  const [boundary, setBoundary] = useState<ExtentsLeftBottomRightTop>()

  const [gettingCoordinate, setGettingCoordinate] = useState(false)

  const readyToSend = useMemo(
    () => !!lineLayer && !!boundary,
    [lineLayer, boundary]
  )

  return (
    <MainContainer>
      <DeckGL
        getTooltip={(o) => {
          if (o.coordinate) {
            return (
              `LNG: ${o.coordinate[0]}\n LAT: ${o.coordinate[1]}` +
              (readyToSend ? "\nRemove Selection" : "")
            )
          }
        }}
        layers={[...staticLayers, polygonLayer, lineLayer]}
        getCursor={(s) => {
          return gettingCoordinate
            ? readyToSend
              ? "not-allowed"
              : "crosshair"
            : "auto"
        }}
        onClick={(e) => {
          if (!gettingCoordinate) {
            return
          }

          if (!!boundary) {
            setBoundary(undefined)
            setLeftTop(undefined)
            setRightBottom(undefined)
            setLineLayer(null)
            return
          }

          if (!!leftTop && !!rightBottom) {
            const [left, top] = leftTop
            const [right, bottom] = rightBottom
            setBoundary([left, bottom, right, top])
            return
          }

          setLeftTop(e.coordinate)
        }}
        onHover={(e) => {
          if (!gettingCoordinate || !leftTop || !!boundary || !e.coordinate) {
            return
          }

          setRightBottom(e.coordinate)

          const [left, top] = leftTop

          const [right, bottom] = e.coordinate

          setPolygonLayer(
            new SolidPolygonLayer({
              data: {
                points: [
                  [left, top],
                  [right, top],
                  [right, bottom],
                  [left, bottom],
                  [left, top]
                ]
              },
              getFillColor: [0, 100, 60, 160],
              wireframe: true,
              getPolygon: (d) => d.points
            })
          )

          setLineLayer(
            new LineLayer({
              id: "selection",
              getWidth: 2,
              data: [
                {
                  sourcePosition: [left, top],
                  targetPosition: [right, top]
                },
                {
                  sourcePosition: [right, top],
                  targetPosition: [right, bottom]
                },
                {
                  sourcePosition: [right, bottom],
                  targetPosition: [left, bottom]
                },
                {
                  sourcePosition: [left, bottom],
                  targetPosition: [left, top]
                }
              ] as any
            })
          )
        }}
        controller={!gettingCoordinate}
        initialViewState={INITIAL_VIEW_STATE}>
        <Map
          mapStyle="mapbox://styles/mapbox/streets-v9"
          mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_KEY}
        />
      </DeckGL>
      <GetCoordinateButton
        active={gettingCoordinate}
        onClick={() => {
          setGettingCoordinate(!gettingCoordinate)
          setStaticLayers(!gettingCoordinate ? [] : [])
        }}>
        <Svg3DRectThreePts />
      </GetCoordinateButton>
      {gettingCoordinate && (
        <SendCoordinateButton
          title="Mark for ML Assessment Queue"
          disabled={!readyToSend}>
          <TriangleFlagFull />
        </SendCoordinateButton>
      )}
    </MainContainer>
  )
}

export default IndexPage
