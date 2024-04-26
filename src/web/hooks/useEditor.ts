import { noteState } from "../state";

export default function useEditor() {
  const editorText = noteState.noteContent;
  const activeNoteId = noteState.activeNoteId;

  return [editorText, activeNoteId];
}
