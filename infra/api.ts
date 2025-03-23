import { bucket, database } from "./storage";

// Create the API
export const api = new sst.aws.ApiGatewayV2("dododoApi", {
  link: [bucket, database],
});

api.route("ANY /{proxy+}", "packages/functions/src/api/index.handler");
