import { TileLayer } from "@deck.gl/geo-layers"
import { createProvider } from "puro"
import { useContext, useState } from "react"

import { dateImageMap, dateList, max, startDate } from "./mock-data"

export enum LayerPeriod {
  Default = "default",
  Pre = "pre",
  Post = "post"
}

const useViewDamageProvider = () => {
  const [damageLayer, setDamageLayer] = useState<TileLayer<any>>(null)

  const [activePeriod, setActivePeriod] = useState(LayerPeriod.Default)

  return {
    damageLayer,
    setDamageLayer,
    activePeriod,
    setActivePeriod,
    dateImageMap,
    startDate,
    dateList,
    max
  }
}

const { BaseContext, Provider } = createProvider(useViewDamageProvider)

export const ViewDamageProvider = Provider

export const useViewDamage = () => useContext(BaseContext)
