import styled from "@emotion/styled"
import { AddPinAlt, CursorPointer, MinusPinAlt } from "iconoir-react"
import { rgba } from "polished"

import { useStatusUpdate } from "~features/layouts/use-status-update"
import { useMarkCoordinate } from "~features/marking-coordinate/use-mark-coordinate"
import { useViewDamage } from "~features/view-damage/use-view-damage"

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
  justify-content: right;
  align-items: center;

  width: 180px;

  gap: 8px;
  transition: 0.2s ease-in-out;

  border-bottom: 1px solid ${(p) => p.theme.colors.white};
  padding: 8px 0;

  &:last-child {
    border-bottom: none;
  }
`

export const CoordinateInfo = () => {
  const { endPos, polygons, startPos, cursorPos } = useMarkCoordinate()
  const { status } = useStatusUpdate()

  const { pollingJobId, pollingError, pollingStatus } = useViewDamage()

  return (
    // TODO: show the polygons, somehow ... but not like this:
    // {polygons.map((p) => <CoordinateGroup>{polygons}</CoordinateGroup>)}
    <CoordinateInfoContainer>
      {!pollingError && pollingStatus && (
        <CoordinateGroup>{`${pollingJobId}: ${pollingStatus?.status}`}</CoordinateGroup>
      )}
      {status && <CoordinateGroup>{status}</CoordinateGroup>}
      {false && endPos && (
        <CoordinateGroup>
          <div>
            {endPos[1].toFixed(6)}
            <b>- LAT</b> <br />
            {endPos[0].toFixed(6)}
            <b>- LNG </b>
          </div>
          <h3>
            <MinusPinAlt />
          </h3>
        </CoordinateGroup>
      )}
      {false && startPos && (
        <CoordinateGroup>
          <div>
            {startPos[1].toFixed(6)}
            <b>- LAT</b>
            <br />
            {startPos[0].toFixed(6)}
            <b>- LNG </b>
          </div>
          <h3>
            <AddPinAlt />
          </h3>
        </CoordinateGroup>
      )}

      <CoordinateGroup>
        <div>
          {cursorPos && cursorPos[1].toFixed(6)}
          <b>- LAT</b> <br />
          {cursorPos && cursorPos[0].toFixed(6)}
          <b>- LNG </b>
        </div>
        <h3>
          <CursorPointer />
        </h3>
      </CoordinateGroup>
    </CoordinateInfoContainer>
  )
}
