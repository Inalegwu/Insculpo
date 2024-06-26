import { createContext } from "@src/shared/context";
import { appRouter } from "@src/shared/routers/_app";
import { BrowserWindow, app, globalShortcut } from "electron";
import { createIPCHandler } from "electron-trpc/main";
import { join } from "node:path";

app.setName("Insculpo");

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    frame: false,
    resizable: true,
    show: false,
    minWidth: 700,
    minHeight: 500,
    maxHeight: 1000,
    maxWidth: 1000,
    backgroundMaterial: "mica",
    webPreferences: {
      sandbox: false,
      preload: join(__dirname, "../preload/preload.js"),
    },
  });

  createIPCHandler({
    router: appRouter,
    windows: [mainWindow],
    createContext,
  });

  mainWindow.webContents.on("did-finish-load", () => {
    mainWindow.show();
  });

  globalShortcut.register("CmdOrCtrl+Shift+Space", () => {
    mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show();
  });

  if (import.meta.env.DEV) {
    mainWindow.loadURL("http://localhost:5173");
  } else {
    mainWindow.loadFile(join(__dirname, "../renderer/index.html"));
  }

  mainWindow.webContents.openDevTools({ mode: "detach" });
};

app.whenReady().then(() => {
  createWindow();
});

app.once("window-all-closed", () => app.quit());
