import { Position } from "@deck.gl/core"
import { BitmapLayer } from "@deck.gl/layers"
import { useContext, useState } from "react"

import { createProvider } from "~core/base-provider"

import { dateImageMap, dateList, max, startDate } from "./mock-data"

const useViewDamageProvider = () => {
  const [preLayers, setPreLayers] = useState<Array<BitmapLayer<Position>>>([])

  const [postLayers, setPostLayers] = useState<Array<BitmapLayer<Position>>>([])

  return {
    preLayers,
    postLayers,
    setPreLayers,
    setPostLayers,

    dateImageMap,
    startDate,
    dateList,
    max
  }
}

const { BaseContext, Provider } = createProvider(useViewDamageProvider)

export const ViewDamageProvider = Provider

export const useViewDamage = () => useContext(BaseContext)
