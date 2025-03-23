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
        supabase: {
          version: "1.4.1",
          accessToken: process.env.SUPABASE_ACCESS_TOKEN,
        },
      },
    };
  },
  async run() {
    const storage = await import("./infra/storage");
    await import("./infra/auth");
    await import("./infra/api");
    await import("./infra/frontApp");

    return {
      uploads: storage.bucket.name,
      Region: aws.getRegionOutput().name,
    };
  },
});
