import { createEnv } from "@t3-oss/env-nextjs"
import { z } from "zod"

export const env = createEnv({
  client: {
    NEXT_PUBLIC_APP_URL: z.string().min(1),
  },
  server: {
    PRIVATE_KEY: z.string().min(1),
    AI: z.object({
      ENDPOINT: z.string().min(1),
      API_KEY: z.string().min(1),
      MODEL_NAME: z.string().min(1),
    }),
  },
  runtimeEnv: {
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    PRIVATE_KEY: process.env.PRIVATE_KEY,
    AI: {
      ENDPOINT: process.env.AI_ENDPOINT,
      API_KEY: process.env.AI_API_KEY,
      MODEL_NAME: process.env.AI_MODEL_NAME,
    },
  },
})
