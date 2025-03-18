import { transactionPooler } from "@/db/url";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql", // 'mysql' | 'sqlite' | 'turso'
  schema: ["./src/db/schema.ts"],
  out: "./migrations",
  casing: "snake_case",
  dbCredentials: {
    url: transactionPooler,
  },
});
