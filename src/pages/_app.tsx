import { NextSeo } from "next-seo"
import type { AppProps } from "next/app"

import { FavIcon, SEO } from "~core/seo"
import { GlobalStyle, XViewTheme } from "~core/theme"

function XViewUIApp({ Component, pageProps }: AppProps) {
  return (
    <XViewTheme>
      <NextSeo {...SEO} />
      <FavIcon />
      <GlobalStyle />
      <Component {...pageProps} />
    </XViewTheme>
  )
}

export default XViewUIApp
