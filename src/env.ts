import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  client: {
    VITE_APP_TITLE: z.string().min(1).optional(),
    VITE_CLERK_PUBLISHABLE_KEY: z.string().min(1),
    VITE_CONVEX_SITE_URL: z.url().optional(),
    VITE_CONVEX_URL: z.url(),
    VITE_SENTRY_DSN: z.url().optional(),
    VITE_SENTRY_ORG: z.string().min(1).optional(),
    VITE_SENTRY_PROJECT: z.string().min(1).optional(),
  },
  clientPrefix: "VITE_",
  emptyStringAsUndefined: true,
  runtimeEnv: {
    ...process.env,
    ...import.meta.env,
  },
  server: {
    ADMIN_CLERK_USER_IDS: z.string().min(1).optional(),
    ADMIN_EMAILS: z.string().min(1).optional(),
    CLERK_FRONTEND_API_URL: z.url().optional(),
    CLERK_JWT_ISSUER_DOMAIN: z.url().optional(),
    CONVEX_DEPLOYMENT: z.string().min(1).optional(),
    SENTRY_AUTH_TOKEN: z.string().min(1).optional(),
  },
});
