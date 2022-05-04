import { useTheme } from "@emotion/react"
import styled from "@emotion/styled"
import { Keyframe, KeyframePosition } from "iconoir-react"
import dynamic from "next/dynamic"
import { useState } from "react"

import { ActionButton } from "~features/layouts/action-button"

import { LayerPeriod, useViewDamage } from "./use-view-damage"

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
      height: 8px;
      /* border-radius: 100%; */

      margin-bottom: 22px;
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
  const {
    tileSets,
    max,
    activeTileSet,
    setActiveTileSet,
    activePeriod,
    setActivePeriod
  } = useViewDamage()

  const theme = useTheme()

  return (
    <SliderContainer>
      <ReactSlider
        onChange={([preIndex, postIndex]: number[]) => {
          if (activePeriod === LayerPeriod.Default) {
            return
          }
          const tileSet =
            activePeriod === LayerPeriod.Pre
              ? tileSets[preIndex]
              : tileSets[postIndex]

          if (activeTileSet.timestamp === tileSet.timestamp) {
            return
          }

          setActiveTileSet(tileSet)
        }}
        className="slider"
        thumbClassName="thumb"
        markClassName="mark"
        trackClassName="track"
        ariaLabel={[LayerPeriod.Pre, LayerPeriod.Post] as never}
        defaultValue={[0, max] as never}
        marks
        pearling
        min={0}
        max={max}
        orientation="vertical"
        invert
        renderMark={(props) => (
          <Mark
            {...props}
            date={new Date(tileSets[props.key].timestamp).toDateString()}
          />
        )}
        renderThumb={(props, state) => {
          const label = props["aria-label"] as LayerPeriod

          const isPre = label === LayerPeriod.Pre
          const isActive = label === activePeriod

          const tileSet = tileSets[state.valueNow]

          return (
            <div
              {...props}
              style={{
                ...props.style,
                backgroundColor: isActive
                  ? theme.colors.secondary
                  : theme.colors.white,
                color: isActive ? theme.colors.white : theme.colors.darkPrimary
              }}
              onClick={() =>
                setActivePeriod((c) => {
                  const isEnabled = c === label

                  setActiveTileSet(isEnabled ? null : tileSet)

                  return isEnabled ? LayerPeriod.Default : label
                })
              }>
              {isPre ? <KeyframePosition /> : <Keyframe />}
              <Timestamp>
                {new Date(tileSet.timestamp).toDateString()}
              </Timestamp>
            </div>
          )
        }}
      />
    </SliderContainer>
  )
}
