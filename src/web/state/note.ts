import { observable } from "@legendapp/state";

type NoteState = {
  activeNoteId: string | null;
};

export const noteState = observable<NoteState>({
  activeNoteId: null,
});
