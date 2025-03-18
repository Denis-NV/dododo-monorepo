import { defineConfig } from "drizzle-kit";
import { Resource } from "sst";

export default defineConfig({
  dialect: "postgresql", // 'mysql' | 'sqlite' | 'turso'
  schema: ["./src/api/schema.ts"],
  out: "./src/migrations",
  casing: "snake_case",
  dbCredentials: {
    url: `postgresql://${Resource.dododoDatabase.user}:${Resource.dododoDatabase.password}@${Resource.dododoDatabase.host}:${Resource.dododoDatabase.port}/postgres`,
  },
});
