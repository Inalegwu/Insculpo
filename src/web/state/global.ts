import { observable } from "@legendapp/state";
import {
  configureObservablePersistence,
  persistObservable,
} from "@legendapp/state/persist";
import { ObservablePersistLocalStorage } from "@legendapp/state/persist-plugins/local-storage";
import type { GlobalState } from "@shared/types";

configureObservablePersistence({
  pluginLocal: ObservablePersistLocalStorage,
});

export const globalState$ = observable<GlobalState>({
  colorMode: "dark",
  settingsVisible: false,
  firstLaunch: true,
  editorState: "writing",
});

persistObservable(globalState$, {
  local: "global_state",
});
