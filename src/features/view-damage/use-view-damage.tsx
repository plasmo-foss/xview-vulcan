import { TileLayer } from "@deck.gl/geo-layers"
import { BitmapLayer } from "@deck.gl/layers"
import { createProvider } from "puro"
import { useContext, useEffect, useState } from "react"
import { useHashedState } from "use-hashed-state"

import { callXViewApi } from "~core/xview-api"
import { useMarkCoordinate } from "~features/marking-coordinate/use-mark-coordinate"

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
  const { startPos, endPos, readyToSend } = useMarkCoordinate()

  const [jobId, setJobId] = useHashedState("job-id", "")

  const [damageLayer, setDamageLayer] = useState<TileLayer<any>>(null)
  // createTilesLayer({
  //   itemType: "SkySatCollect",
  //   itemId: "20220407_120032_ssc6_u0001"
  // })

  const [activePeriod, setActivePeriod] = useState(LayerPeriod.Default)

  useEffect(() => {
    if (!readyToSend || !startPos || !endPos) {
      return
    }

    async function sendCoordinates() {
      const newJobId = await callXViewApi("/send-coordinates", {
        start_lon: startPos[0],
        start_lat: startPos[1],
        end_lon: endPos[0],
        end_lat: endPos[1]
      }).then((resp) => resp.json())

      setJobId(newJobId)
    }

    sendCoordinates()
  }, [startPos, endPos, readyToSend, setJobId])

  useEffect(() => {
    if (!jobId) {
      return
    }

    async function fetchPlanetImagery() {
      // const data = await callXViewApi("/fetch-planet-imagery", {
      //   current_date: new Date().toISOString(),
      //   job_id: jobId
      // }).then((resp) => resp.json())
      // console.log(data)
    }

    fetchPlanetImagery()
  }, [jobId])

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

/**
 * Must be child of MarkCoordinateProvider
 */
export const ViewDamageProvider = Provider

export const useViewDamage = () => useContext(BaseContext)
