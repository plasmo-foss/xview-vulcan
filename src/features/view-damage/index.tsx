import styled from "@emotion/styled"
import {
  EyeAlt,
  EyeOff,
  KeyframeAlignVertical,
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
  const [isOsm, setIsOsm] = useState(false)
  const { tileSets } = useViewDamage()

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
        active={isOsm}
        onClick={() => {
          setIsOsm(!isOsm)
        }}>
        {isOsm ? <EyeAlt /> : <EyeOff />}
        <span>OSM</span>
      </OsmToggleButton>
      {showSlider && <TimeSlider />}
    </>
  )
}
