/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "dododo",
      removal: input?.stage === "production" ? "retain" : "remove",
      protect: ["production"].includes(input?.stage),
      home: "aws",
      providers: {
        aws: {
          profile:
            input.stage === "production" ? "dododo-production" : "dododo-dev",
        },
      },
    };
  },
  async run() {
    const storage = await import("./infra/storage");
    await import("./infra/api");

    return {
      MyBucket: storage.bucket.name,
    };
  },
});
