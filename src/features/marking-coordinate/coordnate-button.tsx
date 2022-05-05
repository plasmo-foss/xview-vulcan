import { Suggestion, Svg3DRectThreePts } from "iconoir-react"
import { useMemo } from "react"

import { ActionButton, PrimaryButton } from "~features/layouts/action-button"
import { useViewDamage } from "~features/view-damage/use-view-damage"

import { useMarkCoordinate } from "./use-mark-coordinate"

export const MarkCoordinateButton = () => {
  const { gettingCoordinate, toggleGettingCoordinate } = useMarkCoordinate()

  return (
    <ActionButton
      title="Get Coordinate"
      active={gettingCoordinate}
      onClick={() => {
        toggleGettingCoordinate()
      }}>
      <Svg3DRectThreePts />
    </ActionButton>
  )
}

export const SendCoordinateButton = () => {
  const { hasBoundary } = useMarkCoordinate()

  const { launchAssessment, preTileSet, postTileSet } = useViewDamage()

  const readyToSend = useMemo(
    () => hasBoundary && !!preTileSet && !!postTileSet,
    [hasBoundary, postTileSet, preTileSet]
  )

  return (
    <PrimaryButton
      title="Mark for ML Assessment Queue"
      disabled={!readyToSend}
      onClick={async () => {
        launchAssessment()
      }}>
      <Suggestion />
    </PrimaryButton>
  )
}
