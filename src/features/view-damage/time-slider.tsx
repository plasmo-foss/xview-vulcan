import styled from "@emotion/styled"
import { Keyframe, KeyframePosition } from "iconoir-react"
import dynamic from "next/dynamic"
import { useState } from "react"

import { ActionButton } from "~features/layouts/action-button"

const ReactSlider = dynamic(() => import("react-slider"), {
  ssr: false
})

export const ToggleSliderButton = styled(ActionButton)`
  position: absolute;
  top: 80px;
  left: 22px;
`

const SliderContainer = styled.div`
  position: absolute;
  top: 140px;
  left: 22px;

  .slider {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border-radius: 44px;
    height: calc(80vh - 80px);
    width: 46px;
    border: 2px solid ${(p) => p.theme.colors.white};
    .track {
      width: 2px;
      margin: 22px;
      background: ${(p) => p.theme.colors.white};
      transition: 0.2s ease-in-out;
    }
    .mark {
      width: 16px;
      height: 16px;
      margin-bottom: 22px;
      border-radius: 100%;
      background: ${(p) => p.theme.colors.white};
      &:hover {
        transform: scale(1.1);
      }
    }
    .thumb {
      width: 44px;
      height: 44px;
      border-radius: 100%;

      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;

      background-color: ${(p) => p.theme.colors.white};
      color: ${(p) => p.theme.colors.darkPrimary};

      border: 4px solid ${(p) => p.theme.colors.darkPrimary};

      cursor: pointer;
      box-sizing: border-box;
      transition: 0.2s ease-in-out;
      &:hover {
        transform: scale(1.1);
      }
    }
  }
`

const Timestamp = styled.div`
  position: absolute;
  left: 44px;
  width: 80px;
  padding: 8px;
  border-radius: 4px;
  font-size: 12px;
  color: ${(p) => p.theme.colors.black};
  background-color: ${(p) => p.theme.colors.white};
`

const startDate = new Date("2022-02-14")

const ONE_DAY_IN_MS = 24 * 60 * 60 * 1000
const PERIOD_IN_MS = ONE_DAY_IN_MS * 7

const getDateList = (startDate: Date, endDate = new Date()) =>
  Array(
    Math.floor((endDate.getTime() - startDate.getTime()) / PERIOD_IN_MS) + 1
  )
    .fill(null)
    .map((_, idx) => new Date(startDate.getTime() + idx * PERIOD_IN_MS))

const dateList = getDateList(startDate)

const max = dateList.length - 1

const Mark = (props: any) => {
  const [hover, setHover] = useState(false)

  return <div {...props}></div>
}

export const TimeSlider = () => {
  return (
    <SliderContainer>
      <ReactSlider
        className="slider"
        thumbClassName="thumb"
        markClassName="mark"
        trackClassName="track"
        ariaLabel={["start", "end"] as never}
        defaultValue={[0, max] as never}
        marks={true}
        pearling
        min={0}
        max={max}
        orientation="vertical"
        invert
        renderMark={(props) => <Mark {...props} />}
        renderThumb={(props, state) => {
          const isStart = props["aria-label"] === "start"
          return (
            <div {...props}>
              {isStart ? <KeyframePosition /> : <Keyframe />}
              <Timestamp>{dateList[state.valueNow].toDateString()}</Timestamp>
            </div>
          )
        }}
      />
    </SliderContainer>
  )
}
