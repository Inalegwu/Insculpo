import { useObservable } from "@legendapp/state/react";
import t from "@src/shared/config";
import { useRef } from "react";
import { noteState } from "../state";
import { useThrottle } from "./useThrottle";

export default function useEditor() {
  const editorRef = useRef<HTMLTextAreaElement>(null);
  const editorText = useObservable<string>("");
  const activeNoteId = noteState.activeNoteId.get();

  const { mutate } = t.notes.saveNote.useMutation();

  const handleEditorChange = useThrottle(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      editorText.set(e.currentTarget.value);

      mutate({ noteId: activeNoteId, content: editorText.get() });
    },
    3000,
  );

  return [editorRef, editorText, handleEditorChange];
}
