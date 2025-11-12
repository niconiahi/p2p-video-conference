import { createRequestHandler } from "react-router";
import { Broadcaster } from "./durable-objects/broadcaster";

declare module "react-router" {
  export interface AppLoadContext {
    cloudflare: {
      env: Env;
      ctx: ExecutionContext;
    };
  }
}

const requestHandler = createRequestHandler(
  () => import("virtual:react-router/server-build"),
  import.meta.env.MODE,
);

export { Broadcaster };

export default {
  async fetch(request, env, ctx) {
    const upgrade_header = request.headers.get("Upgrade");
    console.log("upgrade_header", upgrade_header);
    if (upgrade_header === "websocket") {
      const url = new URL(request.url);
      const host = url.searchParams.get("host");
      if (!host) {
        throw new Error('"host" search param is required');
      }
      const id = env.BROADCASTER.idFromName(host);
      console.log("id", id);
      const stub = env.BROADCASTER.get(id);
      console.log("stub", stub);
      return stub.fetch(request);
    }
    return requestHandler(request, {
      cloudflare: { env, ctx },
    });
  },
} satisfies ExportedHandler<Env>;
