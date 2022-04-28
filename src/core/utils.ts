import { RGBAColor } from "@deck.gl/core"
import { rgb } from "d3-color"

export function colorToRGBArray(color: any): RGBAColor {
  if (!color) {
    return [255, 255, 255, 0]
  }
  if (Array.isArray(color)) {
    return color.slice(0, 4) as RGBAColor
  }
  const c = rgb(color)
  return [c.r, c.g, c.b, 255]
}
