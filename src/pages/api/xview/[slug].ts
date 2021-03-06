import { NextApiRequest, NextApiResponse } from "next"
import qs from "query-string"

import { APIMethod, xviewApiSet } from "~core/xview-api"

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { slug, ...query } = req.query

  if (!xviewApiSet.has(`/${slug}`)) {
    return res.status(404).end()
  }

  const init: RequestInit = {
    method: req.method,
    headers: {
      "Content-Type": "application/json",
      "Access-Key": process.env.AI_INTERNAL_API_KEY
    }
  }

  switch (req.method) {
    case APIMethod.POST:
    case APIMethod.PUT:
      init.body = req.body
      break
  }

  const resp = await fetch(
    `${process.env.AI_INTERNAL_ENDPOINT}/${slug}?${qs.stringify(query)}`,
    init
  )

  const data = await resp.json()

  if (resp.status !== 200) {
    console.error(data)
    return res.status(resp.status).end()
  }

  return res.status(resp.status).json(data)
}

export default handler
