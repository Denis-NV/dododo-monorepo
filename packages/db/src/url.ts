import { Resource } from "sst";

export const transactionPooler = `postgresql://${Resource.dododoDatabase.user}:${Resource.dododoDatabase.password}@${Resource.dododoDatabase.host}:${Resource.dododoDatabase.port}/${Resource.dododoDatabase.database}`;
