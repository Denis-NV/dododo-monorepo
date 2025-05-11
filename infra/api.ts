import { bucket, database } from "./storage";
import { email } from "./email";

const CipherKey = new sst.Secret("CipherKey");
const AccessTokenSecret = new sst.Secret("AccessTokenSecret");
const RefreshTokenSecret = new sst.Secret("RefreshTokenSecret");

// Create the API
export const api = new sst.aws.ApiGatewayV2("dododoApi", {
  link: [
    bucket,
    database,
    email,
    CipherKey,
    AccessTokenSecret,
    RefreshTokenSecret,
  ],
});

api.route("ANY /{proxy+}", {
  handler: "packages/functions/src/api/index.handler",
  nodejs: {
    install: ["@node-rs/argon2"],
  },
});
