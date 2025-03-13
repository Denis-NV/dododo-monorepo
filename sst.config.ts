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
        // neon: {
        //   version: "0.6.3",
        //   apiKey: process.env.NEON_API_KEY,
        // },
      },
    };
  },
  async run() {
    const storage = await import("./infra/storage");
    await import("./infra/api");
    await import("./infra/frontApp");
    // await import("./infra/database");

    return {
      storage: storage.bucket.name,
    };
  },
});
