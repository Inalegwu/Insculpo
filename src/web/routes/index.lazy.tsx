import { useObservable } from "@legendapp/state/react";
import { Flex, TextArea } from "@radix-ui/themes";
import t from "@src/shared/config";
import { createLazyFileRoute } from "@tanstack/react-router";
import React, { useCallback } from "react";
import toast from "react-hot-toast";
import { noteState } from "../state";

export const Route = createLazyFileRoute("/")({
  component: Index,
});

function Index() {
  const utils = t.useUtils();
  const text = useObservable("");
  const note = noteState.get();

  const { mutate: saveNote } = t.notes.saveNote.useMutation({
    onSuccess: (d) => {
      if (d) {
        noteState.activeNoteId.set(d.id);
        utils.notes.getNotes.invalidate();
      }
    },
    onError: (e) => {
      toast.error(e.message, {
        duration: 2000,
      });
    },
  });

  t.notes.getNote.useQuery(
    {
      noteId: note.activeNoteId,
    },
    {
      onSuccess: (d) => {
        if (d === null) return;
        noteState.activeNoteId.set(d._id);
        text.set(d.body);
      },
    },
  );

  const handleEditorInput = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      if (e.currentTarget.value.length < 25) {
        text.set(e.currentTarget.value);
      }
      text.set(e.currentTarget.value);
    },
    [text],
  );

  const handleBlur = useCallback(() => {
    console.log("blurring...");
    saveNote({
      content: text.get(),
      noteId: note.activeNoteId,
    });
    noteState.activeNoteId.set(null);
    text.set("");
  }, [saveNote, text, note]);

  return (
    <Flex direction="column" gap="2" className="w-full h-full bg-slate-50">
      <TextArea
        value={text.get()}
        onChange={handleEditorInput}
        className="w-full h-full outline-indigo-100"
        onBlur={handleBlur}
      />
      <Flex className="absolute z-10 bottom-2 rounded-full right-2 px-3 py-3" />
    </Flex>
  );
}
