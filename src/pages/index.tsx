import DeckGL from "@deck.gl/react"
import { Svg3DEllipseThreePts } from "iconoir-react"
import type { NextPage } from "next"
import { Map } from "react-map-gl"

import { ActionButton } from "~features/layouts/action-button"
import { RightPanelContainer } from "~features/layouts/control-panel"
import {
  Footer,
  MainContainer,
  TopAttribution
} from "~features/layouts/main-container"
import { StatusUpdateProvider } from "~features/layouts/use-status-update"
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
  const { gettingCoordinate, hasBoundary } = markCoordinate

  const { damageLayer, assessmentLayer, osmBuildingLayer } = useViewDamage()

  // const [geoJsonLayer, setGeoJsonLayer] = useState<GeoJsonLayer<any>>()

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
        layers={[
          damageLayer,
          // geoJsonLayer,
          assessmentLayer,
          osmBuildingLayer,
          ...markCoordinate.layers
        ]}
        getCursor={(s) => {
          return gettingCoordinate
            ? hasBoundary
              ? "not-allowed"
              : "crosshair"
            : "auto"
        }}
        onClick={(e) => {
          markCoordinate.toggleMarker(e)
        }}
        onHover={(e) => {
          markCoordinate.setCursorPos(e.coordinate)
        }}>
        <Map
          mapStyle="mapbox://styles/mapbox/streets-v9"
          mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_KEY}
        />
      </DeckGL>

      <CoordinateInput />
      <ViewDamagePanel />

      <RightPanelContainer>
        {/* <ActionButton
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
                  extruded: false,
                  pointType: "circle",
                  lineWidthScale: 1,
                  lineWidthMinPixels: 1,
                  getFillColor: (d) => {
                    const colorScale = d.properties.dmg || 0
                    return [256, 256 * colorScale, 256 * colorScale, 160]
                  },
                  getLineColor: [0, 0, 0, 255]
                })
              )
            }
          }}>
          <Svg3DCenterBox />
        </ActionButton> */}
        <MarkCoordinateButton />
        <SendCoordinateButton />

        <ActionButton
          title="Reset Bearing and Pitch"
          onClick={() => {
            setBearing(0)
            setPitch(0)
          }}>
          <Svg3DEllipseThreePts />
        </ActionButton>
      </RightPanelContainer>

      <CoordinateInfo />
      <TopAttribution />
      <Footer />
    </MainContainer>
  )
}

const IndexPage: NextPage = () => (
  <StatusUpdateProvider>
    <MapNavigationProvider>
      <MarkCoordinateProvider>
        <ViewDamageProvider>
          <Main />
        </ViewDamageProvider>
      </MarkCoordinateProvider>
    </MapNavigationProvider>
  </StatusUpdateProvider>
)

export default IndexPage
