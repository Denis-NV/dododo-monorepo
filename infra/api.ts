import { bucket, database } from "./storage";

// Create the API
export const api = new sst.aws.ApiGatewayV2("dododoApi", {
  link: [bucket, database],
  transform: {
    route: {
      handler: {
        copyFiles: [
          {
            from: "packages/functions/src/migrations",
            to: "migrations",
          },
        ],
      },
    },
  },
});

api.route("GET /migrate", "packages/functions/src/migrate/index.handler");
api.route("ANY /{proxy+}", "packages/functions/src/api/server.handler");
