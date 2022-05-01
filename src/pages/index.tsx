import { GeoJsonLayer } from "@deck.gl/layers"
import DeckGL from "@deck.gl/react"
import { Suggestion, Svg3DCenterBox, Svg3DRectThreePts } from "iconoir-react"
import "mapbox-gl/dist/mapbox-gl.css"
import type { NextPage } from "next"
import { useState } from "react"
import { Map } from "react-map-gl"

import packageJson from "~/../package.json"
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
} from "~features/marking-coordinate/use-mark-coordinate"
import { ViewDamagePanel } from "~features/view-damage"
import {
  ViewDamageProvider,
  useViewDamage
} from "~features/view-damage/use-view-damage"

const Main = () => {
  const { viewState, setBearing, setCoordinate, setPitch, setZoom } =
    useMapNavigation()

  const markCoordinate = useMarkCoordinate()
  const { gettingCoordinate, readyToSend } = markCoordinate

  const { damageLayer } = useViewDamage()

  const [geoJsonLayer, setGeoJsonLayer] = useState<GeoJsonLayer<any>>()

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
        layers={[damageLayer, markCoordinate.lineLayer, geoJsonLayer]}
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
          customAttribution={`❤️☮️🤚 | www.plasmo.com | ${packageJson.name}@${packageJson.version}`}
          mapStyle="mapbox://styles/mapbox/streets-v9"
          mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_KEY}>
          <StartAndEndMarkers />
        </Map>
      </DeckGL>

      <CoordinateInput />
      <ViewDamagePanel />

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
      </RightPanelContainer>

      <CoordinateInfo />
    </MainContainer>
  )
}

const IndexPage: NextPage = () => (
  <MapNavigationProvider>
    <MarkCoordinateProvider>
      <ViewDamageProvider>
        <Main />
      </ViewDamageProvider>
    </MarkCoordinateProvider>
  </MapNavigationProvider>
)

export default IndexPage
