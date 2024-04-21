import { useObservable } from "@legendapp/state/react";
import { DownloadSimple, Eye, Plus } from "@phosphor-icons/react";
import { Dialog, Flex, IconButton, TextArea, Tooltip } from "@radix-ui/themes";
import t from "@shared/config";
import { MarkdownView } from "@src/web/components";
import { useTimeout, useWindow } from "@src/web/hooks";
import { globalState$, noteState } from "@src/web/state";
import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import type React from "react";
import { useCallback, useEffect, useRef } from "react";
import toast from "react-hot-toast";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const utils = t.useUtils();
  const text = useObservable("");
  const toolbar = useObservable(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const editorState = globalState$.editorState.get();

  useEffect(() => {
    if (noteState.activeNoteId.get() !== null) {
      inputRef.current?.focus();
    }
  }, []);

  useTimeout(() => {
    if (toolbar.get()) {
      toolbar.set(false);
    }
  }, 4000);

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

  const { mutate: dumpNote } = t.notes.dumpNote.useMutation({
    onSuccess: () => {
      toast.success("Note exported successfully", {
        duration: 3500,
      });
    },
    onError: () => {
      toast.error("Couldn't export note at this time", {
        duration: 3500,
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

  useWindow("mousemove", (e) => {
    toolbar.set(true);
  });

  const handleBlur = useCallback(() => {
    saveNote({
      content: text.get(),
      noteId: noteState.activeNoteId.get(),
    });
  }, [saveNote, text]);

  const handleNewNoteClick = useCallback(() => {
    noteState.activeNoteId.set(null);
    text.set("");
  }, [text]);

  const switchEditorState = useCallback(() => {
    if (editorState === "writing") {
      globalState$.editorState.set("viewing");
      return;
    }
    inputRef.current?.focus();
    globalState$.editorState.set("writing");
  }, [editorState]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.keyCode === 47) {
        triggerRef.current?.click();
      }
    },
    [],
  );

  return (
    <>
      {editorState === "writing" ? (
        <TextArea
          onChange={handleEditorInput}
          onKeyDown={handleKeyDown}
          ref={inputRef}
          value={text.get()}
          className="w-full h-full text-sm bg-slate-50 rounded-md"
          onBlur={handleBlur}
        >
          <Dialog.Root>
            <Dialog.Trigger ref={triggerRef} />
            <Dialog.Content>content</Dialog.Content>
          </Dialog.Root>
        </TextArea>
      ) : (
        <MarkdownView content={text.get()} />
      )}
      {/* change from preview mode to non-preview mode */}
      <motion.div
        animate={{ opacity: toolbar.get() ? 1 : 0 }}
        style={{ position: "absolute" }}
        className="absolute bottom-2 left-0"
      >
        <Flex align="center" gap="2" className="px-4 py-2 rounded-md">
          <Tooltip
            content={
              globalState$.editorState.get() === "writing"
                ? "Switch to preview"
                : "Switch to Editor"
            }
          >
            <IconButton
              onClick={switchEditorState}
              variant="outline"
              radius="full"
              size="2"
            >
              <Eye size={15} />
            </IconButton>
          </Tooltip>
          <Tooltip content="Export note">
            <IconButton
              onClick={() => dumpNote({ noteId: noteState.activeNoteId.get() })}
              variant="outline"
              radius="full"
              size="2"
            >
              <DownloadSimple size={15} />
            </IconButton>
          </Tooltip>
          <Tooltip content="New note">
            <IconButton
              radius="full"
              onClick={handleNewNoteClick}
              variant="outline"
              size="2"
            >
              <Plus size={15} />
            </IconButton>
          </Tooltip>
        </Flex>
      </motion.div>
    </>
  );
}
