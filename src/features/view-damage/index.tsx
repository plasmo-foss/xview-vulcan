import { KeyframeAlignVertical, RemoveKeyframeAlt } from "iconoir-react"
import { useState } from "react"

import { TimeSlider, ToggleSliderButton } from "./time-slider"

export const ViewDamagePanel = () => {
  const [showSlider, setShowSlider] = useState(true)

  return (
    <>
      {showSlider && <TimeSlider />}

      <ToggleSliderButton
        title="Toggle Slider"
        active={showSlider}
        onClick={() => {
          setShowSlider(!showSlider)
        }}>
        {showSlider ? <RemoveKeyframeAlt /> : <KeyframeAlignVertical />}
      </ToggleSliderButton>
    </>
  )
}
