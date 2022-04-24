import { useTheme } from "@emotion/react"
import type { NextSeoProps } from "next-seo"
import Head from "next/head"

export const DOMAIN = "nowarpls.org"

export const COMPANY_NAME = "nwp"
export const TWITTER_HANDLE = "@nowarpls"

export const SEO: NextSeoProps = {
  titleTemplate: `${COMPANY_NAME} | %s`,
  title: `Iterate on every push`,
  description: "No War Please.",
  additionalMetaTags: [
    {
      name: "keywords",
      content: "damage assessments"
    },
    {
      name: "author",
      content: COMPANY_NAME
    }
  ],
  twitter: {
    handle: TWITTER_HANDLE,
    site: TWITTER_HANDLE,
    cardType: "summary_large_image"
  },
  openGraph: {
    site_name: "NoWarPls",
    type: "website",
    images: [
      {
        url: `https://www.${DOMAIN}/seo-800x600.png`,
        width: 800,
        height: 600,
        alt: "NoWarPls Dove",
        type: "image/png"
      },
      {
        url: `https://www.${DOMAIN}/seo-1200x630.png`,
        width: 1200,
        height: 630,
        alt: "NoWarPls Dove",
        type: "image/png"
      },
      {
        url: `https://www.${DOMAIN}/seo-1200x700.png`,
        width: 1200,
        height: 700,
        alt: "NoWarPls Dove",
        type: "image/png"
      }
    ]
  }
}

export const FavIcon = () => {
  const theme = useTheme()
  return (
    <Head>
      <link
        rel="apple-touch-icon"
        sizes="180x180"
        href="/favicons/apple-touch-icon.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href="/favicons/favicon-32x32.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="16x16"
        href="/favicons/favicon-16x16.png"
      />
      <link rel="manifest" href="/favicons/site.webmanifest" />
      <link
        rel="mask-icon"
        href="/favicons/safari-pinned-tab.svg"
        color={theme.colors.primary}
      />
      <link rel="shortcut icon" href="/favicons/favicon.ico" />
      <meta name="msapplication-TileColor" content={theme.colors.primary} />
      <meta name="msapplication-config" content="/favicons/browserconfig.xml" />
      <meta name="theme-color" content={theme.colors.white} />{" "}
    </Head>
  )
}
