import { CompositeLayer } from "@deck.gl/core"
import { BitmapLayer } from "@deck.gl/layers"

import { XViewTileSet } from "~core/xview-api"

export class ChipLayer extends CompositeLayer<XViewTileSet> {
  chips: Array<{
    height: number
    width: number
    bbox: string
  }>

  featureId: string

  constructor(props) {
    super(props)
    this.chips = props.chips
    this.featureId = props.featureId
  }

  renderLayers() {
    return this.chips.map(
      (chip, index) =>
        new BitmapLayer({
          id: `${this.id}-${index}`,
          bounds: chip.bbox.split(",").map((v) => parseFloat(v)) as any,
          image: `/api/bitmap/${this.featureId}/${chip.height}/${chip.width}/${chip.bbox}`
        })
    )
  }
}
