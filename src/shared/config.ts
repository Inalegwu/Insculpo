import { QueryClient } from "@tanstack/react-query";
import { createTRPCReact } from "@trpc/react-query";
import { ipcLink } from "electron-trpc/renderer";
import type { AppRouter } from "./routers/_app";

const t = createTRPCReact<AppRouter>();

// configure the tanstack/query client
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      networkMode: "always",
      cacheTime: Number.POSITIVE_INFINITY,
    },
    mutations: {
      networkMode: "always",
      cacheTime: Number.POSITIVE_INFINITY,
    },
  },
});

export const trpcClient = t.createClient({
  // expose the custom ipcLink provided by electron-trpc
  links: [ipcLink()],
});

export default t;
