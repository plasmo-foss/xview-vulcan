import styled from "@emotion/styled"
import {
  Check,
  KeyframeAlignVertical,
  Minus,
  RemoveKeyframeAlt
} from "iconoir-react"
import { useState } from "react"

import { TimeSlider, ToggleSliderButton } from "./time-slider"
import { useViewDamage } from "./use-view-damage"

export const OsmToggleButton = styled(ToggleSliderButton)`
  left: 80px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  span {
    font-size: 9px;
  }
`

export const ViewDamagePanel = () => {
  const [showSlider, setShowSlider] = useState(true)
  const { tileSets, isOsmPoly, setIsOsmPoly } = useViewDamage()

  if (tileSets.length === 0) {
    return null
  }

  return (
    <>
      <ToggleSliderButton
        title="Toggle Slider"
        active={showSlider}
        onClick={() => {
          setShowSlider(!showSlider)
        }}>
        {showSlider ? <RemoveKeyframeAlt /> : <KeyframeAlignVertical />}
      </ToggleSliderButton>
      <OsmToggleButton
        title="Toggle OSM"
        active={isOsmPoly}
        onClick={() => {
          setIsOsmPoly((s) => !s)
        }}>
        {isOsmPoly ? <Check /> : <Minus />}
        <span>OSM</span>
      </OsmToggleButton>
      {showSlider && <TimeSlider />}
    </>
  )
}
