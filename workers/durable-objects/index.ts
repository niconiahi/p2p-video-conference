export { Broadcaster } from "./broadcaster";

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const upgradeHeader = request.headers.get("Upgrade");
    if (upgradeHeader === "websocket") {
      const host = url.searchParams.get("host") || "default";
      const id = env.BROADCASTER.idFromName(host);
      const stub = env.BROADCASTER.get(id);
      return stub.fetch(request);
    }
    return new Response(
      "P2P Video Conference Worker\nUse ?host=<name> with WebSocket upgrade",
      {
        headers: { "Content-Type": "text/plain" },
      },
    );
  },
};
