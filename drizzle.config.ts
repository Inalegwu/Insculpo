import type { Config } from "drizzle-kit";

export default {
  schema: "./src/shared/schema/*.ts",
  out: ".drizzle",
  driver: "better-sqlite",
  dbCredentials: {
    url: "./insculpo.db",
  },
} satisfies Config;
