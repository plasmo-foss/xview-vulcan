import { TileLayer } from "@deck.gl/geo-layers"
import { BitmapLayer, GeoJsonLayer } from "@deck.gl/layers"
import { createProvider } from "puro"
import { useCallback, useContext, useEffect, useMemo, useState } from "react"
import { useHashedState } from "use-hashed-state"

import {
  XViewApiFetchPlanetImageryResponse,
  XViewTileSet,
  callXViewAPI,
  useXViewAPI
} from "~core/xview-api"
import { useStatusUpdate } from "~features/layouts/use-status-update"
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
  const { setStatus } = useStatusUpdate()
  const { hasBoundary, polygons } = useMarkCoordinate()

  const [pollingJobId, setPollingJobId] = useHashedState("job-id", "")
  const [assessmentId, setAssessmentId] = useHashedState("assessment-id", "")

  const [jobId, setJobId] = useState("")

  const [damageLayer, setDamageLayer] = useState<TileLayer<any>>(null)

  const [activePeriod, setActivePeriod] = useState(LayerPeriod.Default)

  const [activeTileSet, setActiveTileSet] = useState<XViewTileSet>(null)
  const [preTileSet, setPreTileSet] = useState<XViewTileSet>(null)
  const [postTileSet, setPostTileSet] = useState<XViewTileSet>(null)

  const [tileSets, setTileSets] = useState<Array<XViewTileSet>>([])

  const [assessmentLayer, setAssessmentLayer] = useState<GeoJsonLayer<any>>()

  const { data: pollingStatus, error: pollingError } = useXViewAPI<{
    status: string
  }>(pollingJobId ? `/job-status` : null, {
    job_id: pollingJobId
  })

  useEffect(() => {
    if (!hasBoundary || !polygons) {
      return
    }

    async function sendCoordinates() {
      setStatus("Sending start and end coordinates...")
      const newJobId = await callXViewAPI("/send-polygons", { polygons }).json<string>();

      setJobId(newJobId)
    }

    sendCoordinates()
  }, [hasBoundary, setJobId, setStatus])

  useEffect(() => {
    if (!jobId) {
      return
    }

    async function fetchPlanetImagery() {
      setStatus("Fetching planet imagery...")
      try {
        const data: XViewApiFetchPlanetImageryResponse = await callXViewAPI(
          "/fetch-planet-imagery",
          {
            job_id: jobId
          }
        ).json()

        const tileSets = data.images.reverse()

        setStatus(null)

        setTileSets(tileSets)
        setPreTileSet(tileSets[0])
        setPostTileSet(tileSets[tileSets.length - 1])
      } catch (error) {
        setStatus("Cannot fetch tileset. Please try again.")
      }
    }

    fetchPlanetImagery()
  }, [jobId, setStatus])

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

  const launchAssessment = useCallback(async () => {
    setPollingJobId(jobId)

    const data = await callXViewAPI("/launch-assessment", {
      job_id: jobId,
      pre_image_id: preTileSet.item_id,
      post_image_id: postTileSet.item_id
    }).json<string>()

    setAssessmentId(data)
  }, [
    jobId,
    preTileSet?.item_id,
    postTileSet?.item_id,
    setPollingJobId,
    setAssessmentId
  ])

  useEffect(() => {
    if (!pollingStatus || pollingStatus.status !== "done") {
      return
    }

    setAssessmentLayer(
      new GeoJsonLayer({
        id: "geojson-layer",
        data: callXViewAPI("/fetch-assessment", {
          job_id: pollingJobId
        }).json(),
        pickable: true,
        stroked: true,
        filled: true,
        extruded: false,
        pointType: "circle",
        lineWidthScale: 1,
        lineWidthMinPixels: 1,
        getFillColor: (d) => {
          const colorScale = (4 - d.properties.dmg) / 3
          return [256, 256 * colorScale, 256 * colorScale, 160]
        },
        getLineColor: [0, 0, 0, 255]
      })
    )
  }, [pollingJobId, pollingStatus, pollingStatus?.status])

  const max = useMemo(() => (tileSets?.length || 1) - 1, [tileSets])

  return {
    pollingJobId,
    pollingStatus,
    pollingError,

    assessmentId,
    assessmentLayer,

    jobId,
    preTileSet,
    postTileSet,

    setPreTileSet,
    setPostTileSet,

    launchAssessment,

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
