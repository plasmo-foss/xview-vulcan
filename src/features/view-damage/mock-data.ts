import type { ExtentsLeftBottomRightTop } from "@deck.gl/core/utils/positions"

export const startDate = new Date("2022-02-14")

const ONE_DAY_IN_MS = 24 * 60 * 60 * 1000
const PERIOD_IN_MS = ONE_DAY_IN_MS * 7

const getDateList = (startDate: Date, endDate = new Date()) =>
  Array(
    Math.floor((endDate.getTime() - startDate.getTime()) / PERIOD_IN_MS) + 1
  )
    .fill(null)
    .map((_, idx) => new Date(startDate.getTime() + idx * PERIOD_IN_MS))

export const dateList = getDateList(startDate)

export const max = dateList.length - 1

export const dateImageMap = dateList.reduce((acc, date, index) => {
  acc[date.toISOString()] = {
    url: `https://picsum.photos/seed/${1000 + index}/500/500`,
    opacity: index / max,
    bounds: [30.4899, 50.4596, 30.5148, 50.4485]
  }
  return acc
}, {} as Record<string, { url: string; opacity: number; bounds: ExtentsLeftBottomRightTop }>)
