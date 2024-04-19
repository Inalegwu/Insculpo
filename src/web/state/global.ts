import { observable } from "@legendapp/state";
import { persistObservable } from "@legendapp/state/persist";
import { GlobalState } from "@shared/types";

export const globalState$ = observable<GlobalState>({
  colorMode: "dark",
  settingsVisible: false,
});

persistObservable(globalState$, {
  local: "global_state",
});
