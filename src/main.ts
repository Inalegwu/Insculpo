import { createContext } from "@src/shared/context";
import { appRouter } from "@src/shared/routers/_app";
import { app, BrowserWindow, globalShortcut, screen } from "electron";
import { createIPCHandler } from "electron-trpc/main";
import { join } from "node:path";

app.setName("Insculpo");

const createWindow = () => {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;
  const mainWindow = new BrowserWindow({
    frame: false,
    resizable: true,
    show: false,
    minWidth: height - 100,
    minHeight: height - 100,
    height: height - 100,
    width: width - 100,
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

  mainWindow.webContents.openDevTools({ mode: "bottom" });
};

app.whenReady().then(() => {
  createWindow();
});

app.once("window-all-closed", () => app.quit());
