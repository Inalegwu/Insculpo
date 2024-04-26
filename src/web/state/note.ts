import { observable } from "@legendapp/state";
import {
  configureObservablePersistence,
  persistObservable,
} from "@legendapp/state/persist";
import { ObservablePersistLocalStorage } from "@legendapp/state/persist-plugins/local-storage";

configureObservablePersistence({
  pluginLocal: ObservablePersistLocalStorage,
});

type NoteState = {
  activeNoteId: string | null;
  noteContent: string | null;
};

export const noteState = observable<NoteState>({
  activeNoteId: null,
  noteContent: "",
});

persistObservable(noteState, {
  local: "note__state",
});
