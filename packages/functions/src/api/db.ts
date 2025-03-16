import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import { Resource } from "sst";

const client = postgres(
  `postgresql://${Resource.dododoDatabase.user}:${Resource.dododoDatabase.password}@${Resource.dododoDatabase.host}:${Resource.dododoDatabase.port}/postgres`,
  { prepare: false }
);

export const db = drizzle(client);
