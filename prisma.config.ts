import "dotenv/config";
import { defineConfig, env } from "prisma/config";

const isProduction = process.env.NODE_ENV === "production";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: isProduction
      ? `${env("TURSO_DATABASE_URL")}?authToken=${env("TURSO_AUTH_TOKEN")}`
      : env("DATABASE_URL"),
  },
});