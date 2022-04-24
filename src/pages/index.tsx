import { DeckGL } from "@deck.gl/react"
import styled from "@emotion/styled"
import type { NextPage } from "next"
import { Map } from "react-map-gl"

const Heading = styled.h1`
  color: ${(p) => p.theme.colors.primary};

  transition: 0.2s ease-in-out;
  &:hover {
    color: ${(p) => p.theme.colors.secondary};
    transform: scale(1.1) translateY(-2px);
  }
`

const MainContainer = styled.main`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
`

const INITIAL_VIEW_STATE = {
  longitude: -122.41669,
  latitude: 37.7853,
  zoom: 13,
  pitch: 0,
  bearing: 0
}

const data = [
  {
    sourcePosition: [-122.41669, 37.7853],
    targetPosition: [-122.41669, 37.781]
  }
]

const Home: NextPage = () => {
  const layers = []

  return (
    <MainContainer>
      <DeckGL
        initialViewState={INITIAL_VIEW_STATE}
        controller
        layers={layers}
        glOptions={{
          powerPreference: "high-performance"
        }}>
        <Map
          initialViewState={{
            longitude: -100,
            latitude: 40,
            zoom: 3.5
          }}
          style={{ width: 600, height: 400 }}
          mapStyle="mapbox://styles/mapbox/streets-v9"
          mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_KEY}
        />
      </DeckGL>
    </MainContainer>
  )
}

export default Home
