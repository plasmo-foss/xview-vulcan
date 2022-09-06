declare namespace NodeJS {
  interface ProcessEnv {
    PUBLIC_URL: string
    VERCEL_ENV: "production" | "preview" | "development"

    MAXAR_API_KEY: string
    PLANET_API_KEY: string
    AI_INTERNAL_ENDPOINT: string
    AI_INTERNAL_API_KEY: string

    APP_USERNAME: string
    APP_PASSWORD: string

    NEXT_PUBLIC_MAPBOX_KEY: string
  }
}

interface Window {}

declare module "@deck.gl/react/deckgl" {
  import Deck, { ContextProviderValue, DeckProps } from "@deck.gl/core/lib/deck"
  import { ReactElement, RefObject } from "react"
  export type DeckGLProps<T = ContextProviderValue> = Partial<DeckProps<T>>
  export default class DeckGL<T = ContextProviderValue> extends React.Component<
    DeckGLProps<T> & {
      children?: ReactNode
    }
  > {
    constructor(props: DeckGLProps<T>)
    componentDidMount(): void
    shouldComponentUpdate(nextProps: any): boolean
    componentDidUpdate(): void
    componentWillUnmount(): void
    pickObject(opts: any): any
    pickMultipleObjects(opts: any): any
    pickObjects(opts: any): any
    _redrawDeck(): void
    _customRender(redrawReason: any): void
    _parseJSX(props: any): any
    _updateFromProps(props: any): void
    render(): ReactElement
    _containerRef: RefObject<HTMLElement>
    deck: Deck
  }
}
