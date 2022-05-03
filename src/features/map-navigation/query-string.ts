import qs from "query-string"

const getNewUrl = (qsValue = "") =>
  `${window.location.protocol}//${window.location.host}${window.location.pathname}?${qsValue}`

export const setQueryStringValue = (
  key = "",
  value = "" as string | number,
  queryString = window.location.search
) => {
  const values = qs.parse(queryString)
  const newQsValue = qs.stringify({ ...values, [key]: value })

  const newUrl = getNewUrl(newQsValue)
  window.history.pushState({ path: newUrl }, "", newUrl)
}

export const getQueryStringValue = (
  key = "",
  queryString = window.location.search
) => {
  const values = qs.parse(queryString)
  return values[key]
}

export const getQueryValueMap = () =>
  qs.parse(window?.location.search) as Record<string, string>
