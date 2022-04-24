import { NextSeo } from "next-seo"
import type { AppProps } from "next/app"
import Head from "next/head"

import { FavIcon, SEO } from "~core/seo"
import { GlobalStyle, NoWarTheme } from "~core/theme"

function NoWarApp({ Component, pageProps }: AppProps) {
  return (
    <NoWarTheme>
      <Head>
        <link
          href="https://api.mapbox.com/mapbox-gl-js/v2.6.1/mapbox-gl.css"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-draw/v1.3.0/mapbox-gl-draw.css"
          type="text/css"
        />
      </Head>
      <NextSeo {...SEO} />
      <FavIcon />
      <GlobalStyle />
      <Component {...pageProps} />
    </NoWarTheme>
  )
}

export default NoWarApp
