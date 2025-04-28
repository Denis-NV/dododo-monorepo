import { bucket, database } from "./storage";

const CipherKey = new sst.Secret("CipherKey");
const AccessTokenSecret = new sst.Secret("AccessTokenSecret");

// Create the API
export const api = new sst.aws.ApiGatewayV2("dododoApi", {
  link: [bucket, database, CipherKey, AccessTokenSecret],
});

api.route("ANY /{proxy+}", {
  handler: "packages/functions/src/api/index.handler",
  nodejs: {
    install: ["@node-rs/argon2"],
  },
});
