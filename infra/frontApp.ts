import { bucket } from "./storage";
import { api } from "./api";

export const frontApp = new sst.aws.Remix("dododoAssesment", {
  link: [bucket, api],
  path: "packages/frontApp",
});
