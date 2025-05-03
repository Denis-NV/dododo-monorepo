import { bucket, database } from "./storage";
import { api } from "./api";

export const frontApp = new sst.aws.Remix("dododoAssesment", {
  link: [bucket, database, api],
  path: "packages/frontApp",
});
