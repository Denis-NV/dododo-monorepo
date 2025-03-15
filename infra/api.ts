import { bucket } from "./storage";

// Create the API
export const api = new sst.aws.ApiGatewayV2("dododoApi", {
  link: [bucket],
  transform: {
    route: {
      // handler: {
      //   link: [table, secret],
      // },
      // args: {
      //   auth: { iam: true },
      // },
    },
  },
});

api.route("ANY /{proxy+}", "packages/functions/src/api/server.handler");
