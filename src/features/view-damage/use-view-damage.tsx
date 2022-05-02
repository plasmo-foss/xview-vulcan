import { TileLayer } from "@deck.gl/geo-layers"
import { BitmapLayer } from "@deck.gl/layers"
import { createProvider } from "puro"
import { useContext, useState } from "react"

import { dateImageMap, dateList, max, startDate } from "./mock-data"

export enum LayerPeriod {
  Default = "default",
  Pre = "pre",
  Post = "post"
}

const getTilesUrl = ({ itemType = "", itemId = "" }) =>
  [0, 1, 2, 3].map((t) => `/api/tiles/${itemType}/${itemId}/${t}/{z}/{x}/{y}`)

const createTilesLayer = ({ itemType = "", itemId = "" }) =>
  new TileLayer({
    // https://wiki.openstreetmap.org/wiki/Slippy_map_tilenames#Tile_servers
    data: getTilesUrl({
      itemType,
      itemId
    }),
    minZoom: 0,
    maxZoom: 18,
    tileSize: 256,

    renderSubLayers: (props) => {
      const {
        bbox: { west, south, east, north }
      } = props.tile

      return new BitmapLayer(props, {
        data: null,
        image: props.data,
        bounds: [west, south, east, north]
      })
    }
  })

const useViewDamageProvider = () => {
  const [damageLayer, setDamageLayer] = useState<TileLayer<any>>(
    createTilesLayer({
      itemType: "SkySatCollect",
      itemId: "20220407_120032_ssc6_u0001"
    })
  )

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
