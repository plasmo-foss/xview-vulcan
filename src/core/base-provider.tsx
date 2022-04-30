import { createContext } from "react"

export function createProvider<T extends () => any>(useProvider: T) {
  type ContextProps = ReturnType<typeof useProvider>

  const BaseContext = createContext<ContextProps>(null)

  const Provider = ({ children = null }) => {
    const provider = useProvider()

    return (
      <BaseContext.Provider value={provider}>{children}</BaseContext.Provider>
    )
  }

  return {
    BaseContext,
    Provider
  }
}
