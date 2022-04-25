import { Layer as GenericLayer } from "@deck.gl/core"
import DeckGL from "@deck.gl/react"
import {
  KeyframeAlignVertical,
  RemoveKeyframeAlt,
  Suggestion,
  Svg3DRectThreePts
} from "iconoir-react"
import "mapbox-gl/dist/mapbox-gl.css"
import type { NextPage } from "next"
import { useState } from "react"
import { Map } from "react-map-gl"

import { MainContainer } from "~features/layouts/main-container"
import { CoordinateInfo } from "~features/marking-coordinate/coordinate-info"
import {
  GetCoordinateButton,
  SendCoordinateButton
} from "~features/marking-coordinate/coordnate-button"
import { StartAndEndMarkers } from "~features/marking-coordinate/map-markers"
import {
  MarkCoordinateProvider,
  useMarkCoordinate
} from "~features/marking-coordinate/mark-coordinate"
import {
  TimeSlider,
  ToggleSliderButton
} from "~features/view-damage/time-slider"

const INITIAL_VIEW_STATE = {
  longitude: -122.41669,
  latitude: 37.7853,
  zoom: 8,
  pitch: 0,
  bearing: 0
}

const Main = () => {
  const markCoordinate = useMarkCoordinate()
  const { gettingCoordinate, readyToSend } = markCoordinate
  const [staticLayers, setStaticLayers] = useState<
    Array<GenericLayer<any, any>>
  >([])

  const [showSlider, setShowSlider] = useState(true)

  return (
    <MainContainer>
      <DeckGL
        initialViewState={INITIAL_VIEW_STATE}
        // getTooltip={(o) => {
        //   if (o.coordinate) {
        //     return (
        //       `LNG: ${o.coordinate[0]}\n LAT: ${o.coordinate[1]}` +
        //       (readyToSend ? "\nRemove Selection" : "")
        //     )
        //   }
        // }}
        layers={[...staticLayers, markCoordinate.lineLayer]}
        getCursor={(s) => {
          return gettingCoordinate
            ? readyToSend
              ? "not-allowed"
              : "crosshair"
            : "auto"
        }}
        onClick={(e) => {
          markCoordinate.toggleStart(e)
        }}
        onHover={(e) => {
          markCoordinate.traceEnd(e)
        }}
        controller={!gettingCoordinate}>
        <Map
          customAttribution={`❤️☮️🤚 | www.plasmo.com`}
          mapStyle="mapbox://styles/mapbox/streets-v9"
          mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_KEY}>
          <StartAndEndMarkers />
        </Map>
      </DeckGL>

      {showSlider && <TimeSlider />}

      <ToggleSliderButton
        title="Toggle Slider"
        active={showSlider}
        onClick={() => {
          setShowSlider(!showSlider)
        }}>
        {showSlider ? <RemoveKeyframeAlt /> : <KeyframeAlignVertical />}
      </ToggleSliderButton>

      <GetCoordinateButton
        title="Get Coordinate"
        active={gettingCoordinate}
        onClick={() => {
          markCoordinate.toggleGettingCoordinate()
          setStaticLayers(!gettingCoordinate ? [] : [])
        }}>
        <Svg3DRectThreePts />
      </GetCoordinateButton>

      <SendCoordinateButton
        top={80}
        title="Mark for ML Assessment Queue"
        disabled={!readyToSend}
        onClick={() => {
          markCoordinate.sendCoordinate()
        }}>
        <Suggestion />
      </SendCoordinateButton>

      <CoordinateInfo />
    </MainContainer>
  )
}

const IndexPage: NextPage = () => (
  <MarkCoordinateProvider>
    <Main />
  </MarkCoordinateProvider>
)

export default IndexPage
