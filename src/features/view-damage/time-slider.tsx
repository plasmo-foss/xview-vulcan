import { BitmapLayer } from "@deck.gl/layers"
import styled from "@emotion/styled"
import { Keyframe, KeyframePosition } from "iconoir-react"
import dynamic from "next/dynamic"
import { useState } from "react"

import { ActionButton } from "~features/layouts/action-button"

import { useViewDamage } from "./use-view-damage"

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
      transition: 0.2s ease-in-out;
      position: relative;

      &:hover {
        background: ${(p) => p.theme.colors.secondary};
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

const MarkTimestamp = styled(Timestamp)`
  transition: 0.2s ease-in-out;
  pointer-events: none;
  left: 36px;
  z-index: 5;
  color: ${(p) => p.theme.colors.white};
  background-color: ${(p) => p.theme.colors.secondary};
`

const Mark = (props: any) => {
  const [hover, setHover] = useState(false)

  return (
    <div
      {...props}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}>
      <MarkTimestamp
        style={{
          opacity: hover ? 1 : 0
        }}>
        {props.date}
      </MarkTimestamp>
    </div>
  )
}

export const TimeSlider = () => {
  const { dateList, max, dateImageMap, setPostLayers, setPreLayers } =
    useViewDamage()

  return (
    <SliderContainer>
      <ReactSlider
        onChange={([preIndex, postIndex]: number[]) => {
          const preDate = dateList[preIndex]
          const postDate = dateList[postIndex]
          // console.log(preDate, postDate)

          // console.log(dateImageMap[postDate.toISOString()])

          const postData = dateImageMap[postDate.toISOString()]
          const preData = dateImageMap[preDate.toISOString()]

          setPostLayers([
            new BitmapLayer({
              id: "post-layer",
              pickable: true,
              bounds: postData.bounds,
              image: postData.url,
              opacity: 0.6
              // desaturate: 0.5,
              // tintColor: [128, 256, 128],
              // transparentColor: [32, 256, 32, 256]
            })
          ])
          setPreLayers([
            new BitmapLayer({
              id: "pre-layer",
              pickable: true,
              bounds: preData.bounds,
              image: preData.url,
              opacity: 1
              // desaturate: 0.5,
              // tintColor: [128, 128, 256],
              // transparentColor: [256, 32, 32, 0]
              // desaturate: 0.1
            })
          ])
        }}
        className="slider"
        thumbClassName="thumb"
        markClassName="mark"
        trackClassName="track"
        ariaLabel={["start", "end"] as never}
        defaultValue={[0, max] as never}
        marks
        pearling
        min={0}
        max={max}
        orientation="vertical"
        invert
        renderMark={(props) => (
          <Mark {...props} date={dateList[props.key].toDateString()} />
        )}
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
