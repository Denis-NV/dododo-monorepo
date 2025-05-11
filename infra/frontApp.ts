import { bucket, database } from "./storage";
import { api } from "./api";

const AccessSessionSecret = new sst.Secret("AccessSessionSecret");

export const frontApp = new sst.aws.Remix("dododoAssesment", {
  link: [bucket, database, api, AccessSessionSecret],
  path: "packages/frontApp",
});
