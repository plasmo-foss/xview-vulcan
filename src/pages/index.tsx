import { Layer as GenericLayer, Position } from "@deck.gl/core"
import { ExtentsLeftBottomRightTop } from "@deck.gl/core/utils/positions"
import { LineLayer, PolygonLayer } from "@deck.gl/layers"
import DeckGL from "@deck.gl/react"
import { useTheme } from "@emotion/react"
import {
  AddPinAlt,
  CursorPointer,
  MinusPinAlt,
  Suggestion,
  Svg3DRectThreePts
} from "iconoir-react"
import "mapbox-gl/dist/mapbox-gl.css"
import type { NextPage } from "next"
import { useMemo, useState } from "react"
import { Map, Marker } from "react-map-gl"

import { CoordinateGroup, CoordinateInfo } from "~components/coordinate-info"
import {
  GetCoordinateButton,
  SendCoordinateButton
} from "~components/coordnate-button"
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

  const [polygonLayer, setPolygonLayer] = useState<PolygonLayer<any>>(null)

  const [staticLayers, setStaticLayers] = useState<
    Array<GenericLayer<any, any>>
  >([])
  const [cursorPos, setCursorPos] = useState<Position>()
  const [startPos, setStartPos] = useState<Position>()
  const [endPos, setEndPos] = useState<Position>()

  const [boundary, setBoundary] = useState<ExtentsLeftBottomRightTop>()

  const [gettingCoordinate, setGettingCoordinate] = useState(false)

  const readyToSend = useMemo(
    () => !!lineLayer && !!boundary,
    [lineLayer, boundary]
  )

  return (
    <MainContainer>
      <DeckGL
        // getTooltip={(o) => {
        //   if (o.coordinate) {
        //     return (
        //       `LNG: ${o.coordinate[0]}\n LAT: ${o.coordinate[1]}` +
        //       (readyToSend ? "\nRemove Selection" : "")
        //     )
        //   }
        // }}
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
            setStartPos(undefined)
            setEndPos(undefined)
            setLineLayer(null)
            return
          }

          if (!!startPos && !!endPos) {
            const [left, top] = startPos
            const [right, bottom] = endPos
            setBoundary([left, bottom, right, top])
            return
          }

          setStartPos(e.coordinate)
        }}
        onHover={(e) => {
          setCursorPos(e.coordinate)
          if (!gettingCoordinate || !startPos || !!boundary || !e.coordinate) {
            return
          }

          setEndPos(e.coordinate)

          const [startLon, startLat] = startPos

          const [endLon, endLat] = e.coordinate

          setPolygonLayer(
            new PolygonLayer({
              data: {
                points: [
                  [startLon, startLat],
                  [endLon, startLat],
                  [endLon, endLat],
                  [startLon, endLat],
                  [startLon, startLat]
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
              ] as any
            })
          )
        }}
        controller={!gettingCoordinate}
        initialViewState={INITIAL_VIEW_STATE}>
        <Map
          customAttribution={`❤️☮️🤚 | www.plasmo.com`}
          mapStyle="mapbox://styles/mapbox/streets-v9"
          mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_KEY}>
          {startPos && (
            <Marker
              longitude={startPos[0]}
              latitude={startPos[1]}
              anchor="bottom">
              <AddPinAlt />
            </Marker>
          )}
          {endPos && (
            <Marker
              longitude={endPos[0]}
              latitude={endPos[1]}
              anchor="top-left">
              <MinusPinAlt />
            </Marker>
          )}
        </Map>
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
          <Suggestion />
        </SendCoordinateButton>
      )}

      <CoordinateInfo>
        {endPos && (
          <CoordinateGroup>
            <div>
              {endPos[0]}
              <b>- LNG </b> <br />
              {endPos[1]}
              <b>- LAT</b>
            </div>
            <h3>
              <MinusPinAlt />
            </h3>
          </CoordinateGroup>
        )}
        {startPos && (
          <CoordinateGroup>
            <div>
              {startPos[0]}
              <b>- LNG </b> <br />
              {startPos[1]}
              <b>- LAT</b>
            </div>
            <h3>
              <AddPinAlt />
            </h3>
          </CoordinateGroup>
        )}

        <CoordinateGroup>
          <div>
            {cursorPos && cursorPos[0]}
            <b>- LNG </b> <br />
            {cursorPos && cursorPos[1]}
            <b>- LAT</b>
          </div>
          <h3>
            <CursorPointer />
          </h3>
        </CoordinateGroup>
      </CoordinateInfo>
    </MainContainer>
  )
}

export default IndexPage
