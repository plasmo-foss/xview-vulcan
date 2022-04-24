import { NextSeo } from "next-seo"
import type { AppProps } from "next/app"

import { FavIcon, SEO } from "~core/seo"
import { GlobalStyle, NoWarTheme } from "~core/theme"

function NoWarApp({ Component, pageProps }: AppProps) {
  return (
    <NoWarTheme>
      <NextSeo {...SEO} />
      <FavIcon />
      <GlobalStyle />
      <Component {...pageProps} />
    </NoWarTheme>
  )
}

export default NoWarApp
