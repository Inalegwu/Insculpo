import type { inferAsyncReturnType } from "@trpc/server";
import { app, BrowserWindow } from "electron";
import { db, signalDB } from "./storage";

export async function createContext() {
  const browserWindow = BrowserWindow.getFocusedWindow();

  return {
    window: browserWindow,
    db,
    app,
    signalDB,
  };
}

export type Context = inferAsyncReturnType<typeof createContext>;
