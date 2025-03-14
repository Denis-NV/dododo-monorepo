// import { bucket } from "./storage";

// export const myApi = new sst.aws.Function("MyApi", {
//   url: true,
//   link: [bucket],
//   handler: "packages/functions/src/api.handler"
// });

// Create the API
export const api = new sst.aws.ApiGatewayV2("dododoApi", {
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

api.route("POST /assesment", "packages/functions/src/createAssesment.main");
api.route("GET /assesment", "packages/functions/src/listAssesments.main");
