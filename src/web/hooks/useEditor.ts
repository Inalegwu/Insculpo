import { useObservable } from "@legendapp/state/react";
import { useRef } from "react";
import { useThrottle } from "./useThrottle";
import {  noteState } from "../state";
import t from "@src/shared/config";

export default function useEditor() {
  const editorRef = useRef<HTMLTextAreaElement>(null);
  const editorText = useObservable<string>("");
  const activeNoteId = noteState.activeNoteId.get();

  const { mutate } = t.notes.saveNote.useMutation({

  })

  const handleEditorChange = useThrottle((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    editorText.set(e.currentTarget.value)

    mutate({ noteId: activeNoteId, content: editorText.get() })

  }, 3000)


  return [editorRef, editorText, handleEditorChange];
}
