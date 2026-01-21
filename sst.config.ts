/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "my-free-vibe-app",
      removal: input?.stage === "production" ? "retain" : "remove",
      home: "cloudflare",
    };
  },
  async run() {
    // 1. Storage: KV namespace (Cloudflare's free tier)
    const kv = new sst.cloudflare.KV("MyFiles");

    // 2. Database: D1 (Cloudflare's free tier)
    const database = new sst.cloudflare.D1("MyTable");

    // 3. Compute: Worker (Cloudflare's free tier)
    const api = new sst.cloudflare.Worker("MyApi", {
      handler: "src/api.handler",
      link: [kv, database], // Automatically grants permissions
      url: true, // Gives you a public HTTPS endpoint instantly
    });

    return {
      endpoint: api.url,
    };
  },
});
