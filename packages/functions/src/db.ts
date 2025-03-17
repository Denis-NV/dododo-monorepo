import { drizzle } from "drizzle-orm/postgres-js";
import { migrate as mig } from "drizzle-orm/postgres-js/migrator";

import postgres from "postgres";

import { Resource } from "sst";

const client = postgres(
  `postgresql://${Resource.dododoDatabase.user}:${Resource.dododoDatabase.password}@${Resource.dododoDatabase.host}:${Resource.dododoDatabase.port}/postgres`,
  { prepare: false }
);

export const db = drizzle({ client, casing: "snake_case" });

export const migrate = async (path: string) => {
  return mig(db, { migrationsFolder: path });
};
