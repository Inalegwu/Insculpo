// custom type definitions can live here

// example global state for an application with customization options
export type GlobalState = {
  colorMode: "dark" | "light";
  settingsVisible: boolean;
  firstLaunch: boolean;
  editorState: "writing" | "viewing";
};

export type Note = {
  name: string;
  body: string;
  createdAt?: number;
  updatedAt?: number;
};
