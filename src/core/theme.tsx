import { ThemeProvider } from "@emotion/react"
import type { ReactNode } from "react"

export const Color = {
  palette: {
    primary: "#713ACA",
    secondary: "#9569D6",
    darkPrimary: "#5f0a87",

    black: "#111111",
    white: "#FFFAFD",
    gray: "#868686",
    darkGray: "#0A0A0A",
    subtleGray: "#242424"
  }
}

const theme = {
  colors: Color.palette
}

type XViewTheme = typeof theme

declare module "@emotion/react" {
  export interface Theme extends XViewTheme {}
}

export const VulcanXViewTheme = ({ children = null as ReactNode }) => (
  <ThemeProvider theme={theme}>
    <GlobalStyle />
    {children}
  </ThemeProvider>
)

export const GlobalStyle = () => (
  <style jsx global>{`
    @import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;800&display=swap");

    html,
    body {
      padding: 0;
      margin: 0;
      font-family: Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
        Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
        sans-serif;
    }

    h1,
    h2,
    h3,
    h4,
    h5,
    h6,
    p,
    input {
      font-family: Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
        Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
        sans-serif;
    }

    body {
      overflow-x: hidden;
    }

    h1,
    h2,
    h3,
    h4,
    h5,
    h6,
    p {
      margin: 0;
    }

    a {
      color: inherit;
      text-decoration: none;
    }

    * {
      box-sizing: border-box;
      max-width: 100vw;
    }

    #__next {
      height: 100vh;
      overflow: hidden;
    }

    * {
      scrollbar-width: thin;
      scrollbar-color: ${Color.palette.primary};
    }

    *::-webkit-scrollbar {
      width: 8px;
      height: 8px;
    }

    *::-webkit-scrollbar-track {
      background-color: ${Color.palette.darkGray};
    }

    *::-webkit-scrollbar-thumb {
      min-height: 42px;
      border: 2px solid ${Color.palette.darkGray};
      border-radius: 4px;
      background-color: ${Color.palette.primary};
    }
  `}</style>
)
