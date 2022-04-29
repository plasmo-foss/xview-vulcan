import { TileLayer } from "@deck.gl/geo-layers"
import { BitmapLayer, GeoJsonLayer } from "@deck.gl/layers"
import DeckGL from "@deck.gl/react"
import {
  KeyframeAlignVertical,
  RemoveKeyframeAlt,
  Suggestion,
  Svg3DCenterBox,
  Svg3DRectThreePts,
  PerspectiveView
} from "iconoir-react"
import "mapbox-gl/dist/mapbox-gl.css"
import type { NextPage } from "next"
import { useState } from "react"
import { Map } from "react-map-gl"

import { ActionButton } from "~features/layouts/action-button"
import { RightPanelContainer } from "~features/layouts/control-panel"
import { MainContainer } from "~features/layouts/main-container"
import { CoordinateInput } from "~features/map-navigation/coordinate-input"
import {
  MapNavigationProvider,
  useMapNavigation
} from "~features/map-navigation/use-map-navigation"
import { CoordinateInfo } from "~features/marking-coordinate/coordinate-info"
import {
  MarkCoordinateButton,
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

const Main = () => {
  const { viewState, setBearing, setCoordinate, setPitch, setZoom } =
    useMapNavigation()

  const markCoordinate = useMarkCoordinate()
  const { gettingCoordinate, readyToSend } = markCoordinate
  // const [staticLayers, setStaticLayers] = useState<
  //   Array<GenericLayer<any, any>>
  // >([])

  const [geoJsonLayer, setGeoJsonLayer] = useState<GeoJsonLayer<any>>()
  const [geoRasterLayer, setgeoRasterLayer] = useState<BitmapLayer<any>>()

  const [showSlider, setShowSlider] = useState(true)

  return (
    <MainContainer>
      <DeckGL
        initialViewState={viewState}
        onViewStateChange={({ viewState: newViewState }) => {
          setCoordinate(newViewState.latitude, newViewState.longitude, {
            fixed: true
          })
          setZoom(newViewState.zoom)
          setBearing(newViewState.bearing)
          setPitch(newViewState.pitch)
        }}
        controller={!gettingCoordinate}
        // getTooltip={(o) => {
        //   if (o.coordinate) {
        //     return (
        //       `LNG: ${o.coordinate[0]}\n LAT: ${o.coordinate[1]}` +
        //       (readyToSend ? "\nRemove Selection" : "")
        //     )
        //   }
        // }}
        layers={[markCoordinate.lineLayer, geoJsonLayer, geoRasterLayer]}
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
        }}>
        <Map
          customAttribution={`❤️☮️🤚 | www.plasmo.com | xView |`}
          mapStyle="mapbox://styles/mapbox/streets-v9"
          mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_KEY}>
          <StartAndEndMarkers />
        </Map>
      </DeckGL>

      <CoordinateInput />
      {showSlider && <TimeSlider />}

      <ToggleSliderButton
        title="Toggle Slider"
        active={showSlider}
        onClick={() => {
          setShowSlider(!showSlider)
        }}>
        {showSlider ? <RemoveKeyframeAlt /> : <KeyframeAlignVertical />}
      </ToggleSliderButton>

      <RightPanelContainer>
        <MarkCoordinateButton
          title="Get Coordinate"
          active={gettingCoordinate}
          onClick={() => {
            markCoordinate.toggleGettingCoordinate()
          }}>
          <Svg3DRectThreePts />
        </MarkCoordinateButton>

        <SendCoordinateButton
          title="Mark for ML Assessment Queue"
          disabled={!readyToSend}
          onClick={() => {
            markCoordinate.sendCoordinate()
          }}>
          <Suggestion />
        </SendCoordinateButton>

        <ActionButton
          title="Toggle GeoJSON"
          active={!!geoJsonLayer}
          onClick={() => {
            if (!!geoJsonLayer) {
              setGeoJsonLayer(null)
            } else {
              setCoordinate(50.454, 30.501)
              setZoom(14)

              setGeoJsonLayer(
                new GeoJsonLayer({
                  id: "geojson-layer",
                  data: fetch("/sample-geo.json").then((r) => r.json()),
                  pickable: true,
                  stroked: true,
                  filled: true,
                  // extruded: true,
                  pointType: "circle",
                  lineWidthScale: 20,
                  lineWidthMinPixels: 2,
                  getFillColor: [180, 0, 0, 200],
                  getLineColor: [160, 0, 0, 255],
                  // getLineColor: (d) => colorToRGBArray(d.properties.color),
                  getPointRadius: 100,
                  getLineWidth: 1,
                  getElevation: 1
                })
              )
            }
          }}>
          <Svg3DCenterBox />
        </ActionButton>

        <ActionButton
          title="Toggle raster"
          active={!!geoRasterLayer}
          onClick={() => {
            if (!!geoRasterLayer) {
              setgeoRasterLayer(null)
            } else {
              setCoordinate(37.723613, -122.39383950)
              setZoom(11)

              setgeoRasterLayer(
                new BitmapLayer({
                  id: 'bitmap-layer',
                  bounds: [-122.5190, 37.7045, -122.355, 37.829],
                  image: 'https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/sf-districts.png'
                })
              )
            }
          }}>
          <PerspectiveView />
        </ActionButton>
      </RightPanelContainer>

      <CoordinateInfo />
    </MainContainer >
  )
}

const IndexPage: NextPage = () => (
  <MapNavigationProvider>
    <MarkCoordinateProvider>
      <Main />
    </MarkCoordinateProvider>
  </MapNavigationProvider>
)

export default IndexPage
