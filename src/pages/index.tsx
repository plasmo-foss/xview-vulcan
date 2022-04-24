import { Layer, Position } from "@deck.gl/core"
import { BitmapLayer } from "@deck.gl/layers"
import { DeckGL } from "@deck.gl/react"
import { Svg3DRectThreePts } from "iconoir-react"
import type { NextPage } from "next"
import { useState } from "react"
import { Map } from "react-map-gl"

import { GetCoordinateButton } from "~components/get-coordnate-button"
import { MainContainer } from "~components/main-container"

const INITIAL_VIEW_STATE = {
  longitude: -122.41669,
  latitude: 37.7853,
  zoom: 13,
  pitch: 0,
  bearing: 0
}

const Home: NextPage = () => {
  const [layers, setLayers] = useState<Array<Layer<any, any>>>([])
  const [top, setTop] = useState<Position>()
  const [left, setLeft] = useState<Position>()
  const [right, setRight] = useState<Position>()
  const [bottom, setBottom] = useState<Position>()

  const [gettingCoordinate, setGettingCoordinate] = useState(false)

  return (
    <MainContainer>
      <DeckGL
        controller={!gettingCoordinate}
        initialViewState={INITIAL_VIEW_STATE}
        layers={layers}
        glOptions={{
          powerPreference: "high-performance"
        }}>
        <GetCoordinateButton
          active={gettingCoordinate}
          onClick={() => {
            setGettingCoordinate((c) => !c)
            setLayers(
              !gettingCoordinate
                ? [
                    new BitmapLayer({
                      id: "bitmap-layer",
                      bounds: [-122.519, 37.7045, -122.355, 37.829],
                      image:
                        "https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/sf-districts.png"
                    })
                  ]
                : []
            )
          }}>
          <Svg3DRectThreePts />
        </GetCoordinateButton>

        <Map
          // onDragEnd={(e) => {
          //   setLayers((current) => [
          //     ...current,
          //     new BitmapLayer({
          //       id: "bitmap-layer",
          //       bounds: [-122.519, 37.7045, -122.355, 37.829],
          //       image:
          //         "https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/sf-districts.png"
          //     })
          //   ])
          // }}
          // onDragStart={(e) => {
          //   // e.target.
          // }}
          // initialViewState={{
          //   longitude: -100,
          //   latitude: 40,
          //   zoom: 3.5
          // }}
          style={{ width: 600, height: 400 }}
          mapStyle="mapbox://styles/mapbox/streets-v9"
          mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_KEY}
        />
      </DeckGL>
    </MainContainer>
  )
}

export default Home
