import { bucket } from "./storage";

export const frontApp = new sst.aws.Remix("dododoAssesment", {
  link: [bucket],
  path: "packages/frontApp",
});
