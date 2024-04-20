import { useObservable } from "@legendapp/state/react";
import { Eye } from "@phosphor-icons/react";
import { Button, Flex, TextArea } from "@radix-ui/themes";
import t from "@src/shared/config";
import { createLazyFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import React, { useCallback, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { noteState } from "../state";

export const Route = createLazyFileRoute("/")({
  component: Index,
});

function Index() {
  const utils = t.useUtils();
  const text = useObservable("");
  const toolbar = useObservable(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {

    if(noteState.activeNoteId.get()!==null){
      inputRef.current?.focus();
    }

    const timeout = setTimeout(() => {
      if (toolbar.get()) {
        toolbar.set(false);
      }
    }, 2000);

    return () => {
      clearTimeout(timeout);
    };
  }, [toolbar,noteState]);

  const { mutate: saveNote } = t.notes.saveNote.useMutation({
    onSuccess: (d) => {
      if (d) {
        utils.notes.invalidate();
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
      noteId: noteState.activeNoteId.get(),
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
      text.set(e.currentTarget.value);
    },
    [text],
  );

  const handleMouseMove = useCallback(() => {
    toolbar.set(true);
  }, [toolbar]);

  const handleBlur = useCallback(() => {
    saveNote({
      content: text.get(),
      noteId: noteState.activeNoteId.get(),
    });
    noteState.activeNoteId.set(null);
    text.set("");
    // console.log(noteState.get());
    // console.log(text.get());
  }, [saveNote, text]);

  return (
    <Flex direction="column" gap="2" className="w-full h-full bg-slate-50">
      <TextArea
        value={text.get()}
        onChange={handleEditorInput}
        ref={inputRef}
        className="w-full h-full outline-indigo-100"
        onBlur={handleBlur}
        onMouseMove={handleMouseMove}
      />
      {/* change from preview mode to non-preview mode */}
      <motion.div
        animate={{ opacity: toolbar.get() ? 1 : 0 }}
        style={{ position: "absolute" }}
        className="absolute bottom-4 left-3"
      >
        <Button variant="soft" radius="full">
          <Eye size={14} />
        </Button>
      </motion.div>
    </Flex>
  );
}
