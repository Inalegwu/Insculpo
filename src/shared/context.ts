import type { inferAsyncReturnType } from "@trpc/server";
import { BrowserWindow, app } from "electron";
import { db } from "./storage";

// attach variables and other state you plan on making
// accessible in your procedures
export async function createContext() {
  // the currently focused BrowserWindow instance
  const browserWindow = BrowserWindow.getFocusedWindow();

  return {
    // exposed under window alias
    window: browserWindow,
    db,
    app,
  };
}

// this type is attached to initTRPC in trpc.ts
export type Context = inferAsyncReturnType<typeof createContext>;
