// custom type definitions can live here

import type { notes } from "./schema";

// example global state for an application with customization options
export type GlobalState = {
  colorMode: "dark" | "light";
  firstLaunch: boolean;
  editorState: "writing" | "viewing";
  appId: string | null;
};

export type Tag = {
  title?: string;
  description?: string;
  url?: string;
  site_name?: string;
  image?: string;
  icon?: string;
  keywords?: string;
};

export type Note = typeof notes.$inferSelect;
