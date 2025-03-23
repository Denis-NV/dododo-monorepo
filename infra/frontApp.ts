import { bucket } from "./storage";
import { auth } from "./auth";

export const frontApp = new sst.aws.Remix("dododoAssesment", {
  link: [bucket, auth],
  path: "packages/frontApp",
});
