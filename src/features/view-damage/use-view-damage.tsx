import { TileLayer } from "@deck.gl/geo-layers"
import { BitmapLayer } from "@deck.gl/layers"
import { createProvider } from "puro"
import { useContext, useEffect, useMemo, useState } from "react"

import {
  XViewApiFetchPlanetImageryResponse,
  XViewTileSet,
  callXViewApi
} from "~core/xview-api"
import { useMarkCoordinate } from "~features/marking-coordinate/use-mark-coordinate"

import { dateImageMap, dateList } from "./mock-data"

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

  const [jobId, setJobId] = useState("")

  const [damageLayer, setDamageLayer] = useState<TileLayer<any>>(null)

  const [activePeriod, setActivePeriod] = useState(LayerPeriod.Default)

  const [activeTileSet, setActiveTileSet] = useState<XViewTileSet>(null)
  const [preTileSet, setPreTileSet] = useState<XViewTileSet>(null)
  const [postTileSet, setPostTileSet] = useState<XViewTileSet>(null)

  const [tileSets, setTileSets] = useState<Array<XViewTileSet>>([])

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
      const data: XViewApiFetchPlanetImageryResponse = await callXViewApi(
        "/fetch-planet-imagery",
        {
          job_id: jobId
        }
      ).then((resp) => resp.json())

      setTileSets(data.images.reverse())
    }

    fetchPlanetImagery()
  }, [jobId])

  useEffect(() => {
    if (!activeTileSet) {
      setDamageLayer(null)
      return
    }

    setDamageLayer(
      createTilesLayer({
        itemType: activeTileSet.item_type,
        itemId: activeTileSet.item_id
      })
    )
  }, [activeTileSet])

  useEffect(() => {
    if (activePeriod === LayerPeriod.Default) {
      return
    }
    const tileSet = activePeriod === LayerPeriod.Pre ? preTileSet : postTileSet

    if (activeTileSet?.timestamp === tileSet.timestamp) {
      return
    }

    setActiveTileSet(tileSet)
  }, [preTileSet, postTileSet, activePeriod, activeTileSet])

  const max = useMemo(() => (tileSets?.length || 1) - 1, [tileSets])

  return {
    setPreTileSet,
    setPostTileSet,

    activeTileSet,
    setActiveTileSet,
    damageLayer,
    activePeriod,
    setActivePeriod,
    dateImageMap,
    tileSets,
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
