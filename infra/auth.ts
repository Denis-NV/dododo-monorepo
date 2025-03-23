export const auth = new sst.aws.Auth("dododoAuth", {
  issuer: "packages/functions/src/auth/index.handler",
});
