import styled from "@emotion/styled"

import { useMapNavigation } from "./use-map-navigation"

const CoordinateInputContainer = styled.div`
  position: absolute;
  top: 22px;
  left: 22px;

  display: flex;

  align-items: center;
  justify-content: center;

  gap: 16px;

  max-width: 60vw;
`

const InputContainer = styled.div`
  height: 44px;
  border-radius: 44px;
  border: 2px solid ${(p) => p.theme.colors.white};
  background-color: ${(p) => p.theme.colors.white};
  width: 30vw;

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

    border: 1px solid ${(p) => p.theme.colors.darkPrimary};
    text-align: end;
  }
`

export const CoordinateInput = () => {
  const { viewState, setLatitude, setLongitude } = useMapNavigation()
  return (
    <CoordinateInputContainer>
      <InputContainer>
        <label>LNG</label>
        <input
          type="number"
          min={-180}
          max={180}
          placeholder="Longitude"
          value={viewState.longitude === 0 ? "" : viewState.longitude.toFixed(6)}
          onChange={(e) => {
            const newLongitude = parseFloat(e.target.value)
            if (isNaN(newLongitude)) {
              setLongitude(0)
              return
            } else if (Math.abs(newLongitude) > 180) {
              return
            }
            setLongitude(parseFloat(e.target.value))
          }}
        />
      </InputContainer>
      <InputContainer>
        <label>LAT</label>
        <input
          type="number"
          placeholder="Latitude"
          value={viewState.latitude === 0 ? "" : viewState.latitude.toFixed(6)}
          min={-90}
          max={90}
          onChange={(e) => {
            const newLatitude = parseFloat(e.target.value)
            if (isNaN(newLatitude)) {
              setLatitude(0)
              return
            } else if (Math.abs(newLatitude) > 90) {
              return
            }
            setLatitude(newLatitude)
          }}
        />
      </InputContainer>
    </CoordinateInputContainer>
  )
}
