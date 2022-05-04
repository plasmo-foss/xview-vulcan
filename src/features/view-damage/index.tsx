import { KeyframeAlignVertical, RemoveKeyframeAlt } from "iconoir-react"
import { useState } from "react"

import { TimeSlider, ToggleSliderButton } from "./time-slider"
import { useViewDamage } from "./use-view-damage"

export const ViewDamagePanel = () => {
  const [showSlider, setShowSlider] = useState(true)
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

      {showSlider && <TimeSlider />}
    </>
  )
}
