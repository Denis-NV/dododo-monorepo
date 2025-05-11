import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { transactionPooler } from "./url";

const client = postgres(transactionPooler, { prepare: false });

export const db = drizzle({ client, casing: "snake_case" });
