import { NextSeo } from "next-seo"
import type { AppProps } from "next/app"

import { FavIcon, SEO } from "~core/seo"
import { GlobalStyle, VulcanXViewTheme } from "~core/theme"

function XViewUIApp({ Component, pageProps }: AppProps) {
  return (
    <VulcanXViewTheme>
      <NextSeo {...SEO} />
      <FavIcon />
      <GlobalStyle />
      <Component {...pageProps} />
    </VulcanXViewTheme>
  )
}

export default XViewUIApp
