declare namespace NodeJS {
  interface ProcessEnv {
    PUBLIC_URL: string
    VERCEL_ENV: "production" | "preview" | "development"

    NEXT_PUBLIC_MAPBOX_KEY: string
  }
}

interface Window {}
