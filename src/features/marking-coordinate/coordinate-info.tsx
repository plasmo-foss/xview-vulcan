import styled from "@emotion/styled"
import { AddPinAlt, CursorPointer, MinusPinAlt } from "iconoir-react"
import { rgba } from "polished"

import { useMarkCoordinate } from "~features/marking-coordinate/mark-coordinate"

const CoordinateInfoContainer = styled.div`
  pointer-events: none;
  color: ${(p) => p.theme.colors.white};
  background: ${(p) => rgba(p.theme.colors.gray, 0.4)};

  position: absolute;
  bottom: 22px;
  right: 22px;

  transition: 0.2s ease-in-out;

  text-align: right;

  padding: 4px 8px;
  border-radius: 8px;

  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: flex-end;
`

const CoordinateGroup = styled.div`
  display: flex;
  justify-content: left;
  align-items: center;

  gap: 8px;
  transition: 0.2s ease-in-out;

  border-bottom: 1px solid ${(p) => p.theme.colors.white};
  padding: 8px 0;

  &:last-child {
    border-bottom: none;
  }
`

export const CoordinateInfo = () => {
  const { endPos, startPos, cursorPos } = useMarkCoordinate()

  return (
    <CoordinateInfoContainer>
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
    </CoordinateInfoContainer>
  )
}
