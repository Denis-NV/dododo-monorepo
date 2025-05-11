import { transactionPooler } from "./src/url";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql", // 'mysql' | 'sqlite' | 'turso'
  schema: ["./src/schema/tables.ts"],
  out: "./migrations",
  casing: "snake_case",
  dbCredentials: {
    url: transactionPooler,
  },
});
