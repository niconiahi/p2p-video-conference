import * as v from "valibot";

export class Broadcaster implements DurableObject {
  private state: DurableObjectState;
  private sessions: Map<WebSocket, string>;

  constructor(state: DurableObjectState) {
    this.state = state;
    this.sessions = new Map();
  }

  async fetch(request: Request) {
    const upgrade_header = request.headers.get("Upgrade");
    if (!upgrade_header || upgrade_header !== "websocket") {
      return new Response("expected WebSocket upgrade", { status: 426 });
    }
    const pair = new WebSocketPair();
    const [sender, receiver] = [pair[0], pair[1]];
    this.state.acceptWebSocket(receiver);
    const url = new URL(request.url);
    const host = url.searchParams.get("host");
    if (!host) {
      throw new Error("host search param is required");
    }
    this.sessions.set(receiver, host);
    return new Response(null, {
      status: 101,
      webSocket: sender,
    });
  }

  async webSocketMessage(ws: WebSocket, message: string) {
    const host = v.parse(v.string(), this.sessions.get(ws));
    for (const [session_ws, session_host] of this.sessions.entries()) {
      if (session_host === host && session_ws !== ws) {
        session_ws.send(message);
      }
    }
  }
}
