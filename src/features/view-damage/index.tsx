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
  const { tileSets, isOsmPoly, toggleOsmPoly } = useViewDamage()

  return (
    <>
      <OsmToggleButton
        title="Toggle OSM"
        active={isOsmPoly}
        onClick={() => toggleOsmPoly()}>
        {isOsmPoly ? <Check /> : <Minus />}
        <span>OSM</span>
      </OsmToggleButton>
      {tileSets.length > 0 && (
        <>
          <ToggleSliderButton
            title="Toggle Slider"
            active={showSlider}
            onClick={() => {
              setShowSlider(!showSlider)
            }}>
            {showSlider ? <RemoveKeyframeAlt /> : <KeyframeAlignVertical />}
          </ToggleSliderButton>

          {showSlider && <TimeSlider />}
        </>
      )}
    </>
  )
}
