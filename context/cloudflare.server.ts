import { createContext } from "react-router";

export const CloudflareContext = createContext<{
  env: Cloudflare.Env;
}>();
