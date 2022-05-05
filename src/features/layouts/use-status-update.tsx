import { createProvider } from "puro"
import { useContext, useState } from "react"

const useStatusUpdateProvider = () => {
  const [status, setStatus] = useState("")

  return {
    status,
    setStatus
  }
}

const { BaseContext, Provider } = createProvider(useStatusUpdateProvider)

export const StatusUpdateProvider = Provider

export const useStatusUpdate = () => useContext(BaseContext)
