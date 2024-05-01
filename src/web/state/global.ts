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
  colorMode: "light",
  firstLaunch: true,
  editorState: "viewing",
  appId: null,
  route: "Notes",
});

persistObservable(globalState$, {
  local: "global_state",
});
