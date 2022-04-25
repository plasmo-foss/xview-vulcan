import styled from "@emotion/styled"
import { Search } from "iconoir-react"

import { useMapNavigation } from "./use-map-navigation"

const CoordinateInputContainer = styled.div`
  position: absolute;
  top: 22px;
  left: 22px;

  display: flex;

  align-items: center;
  justify-content: center;

  gap: 16px;

  width: 100%;
  max-width: 80vw;
`

const InputContainer = styled.div`
  width: 100%;

  height: 44px;
  border-radius: 44px;
  border: 2px solid ${(p) => p.theme.colors.white};
  background-color: ${(p) => p.theme.colors.white};
  padding: 0 12px;
  display: flex;

  align-items: center;
  justify-content: center;
  gap: 8px;

  label {
    font-weight: bold;
  }

  input {
    width: 100%;
    border-radius: 12px;
    border: none;
    outline: none;
    height: 100%;
    font-size: 16px;
    /* border: 1px solid ${(p) => p.theme.colors.darkPrimary}; */
  }
`

export const latLngRegex =
  /^(?<lat>([-+]?)([\d]{1,2})(((\.)(\d+)))),(\s*)(?<lng>([-+]?)([\d]{1,3})((\.)(\d+))?)$/

export const CoordinateInput = () => {
  const { setLatitude, setLongitude, query, setQuery } = useMapNavigation()

  return (
    <CoordinateInputContainer>
      <InputContainer>
        <Search />
        <input
          type="text"
          placeholder="Query your location"
          value={query}
          onChange={(e) => {
            const rawQuery = e.target.value
            setQuery(rawQuery)

            const latLngMatch = latLngRegex.exec(rawQuery)

            if (!!latLngMatch) {
              const [newLat, newLng] = [
                latLngMatch.groups.lat,
                latLngMatch.groups.lng
              ].map((v) => parseFloat(v.trim()))

              if (isNaN(newLat) || isNaN(newLng)) {
                return
              }

              if (newLat < -90 || newLat > 90) {
                return
              }

              if (newLng < -180 || newLng > 180) {
                return
              }

              setLatitude(newLat)
              setLongitude(newLng)
            }
          }}
        />
      </InputContainer>
    </CoordinateInputContainer>
  )
}
