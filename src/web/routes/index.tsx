import { useObservable } from "@legendapp/state/react";
import { DownloadSimple, Eye, Plus } from "@phosphor-icons/react";
import { Dialog, Flex, IconButton, TextArea, Tooltip } from "@radix-ui/themes";
import t from "@shared/config";
import { MarkdownView } from "@src/web/components";
import { useDebounce, useEditor, useInterval, useTimeout, useWindow } from "@src/web/hooks";
import { globalState$, noteState } from "@src/web/state";
import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import type React from "react";
import { useCallback, useRef } from "react";
import toast from "react-hot-toast";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const utils = t.useUtils();
  const text = useObservable<string>("");
  const toolbar = useObservable(false);

  const editorState = globalState$.editorState.get();
  const [editorRef] = useEditor();

  useTimeout(() => {
    if (toolbar.get()) {
      toolbar.set(false);
    }
  }, 1000);

  useInterval(() => {
    // don't save if text is empty
    if (text.get() === "") return;

    saveNote({ noteId: noteState.activeNoteId.get(), content: text.get() });
  }, 2000);

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

  // debounce showing the mouse so the user doesn't 
  // see it all the time
  const handleMouseMove = useDebounce((_e: MouseEvent) => {
    toolbar.set(true)
  }, 50)

  useWindow("mousemove", handleMouseMove)

  const handleNewNoteClick = useCallback(() => {
    globalState$.editorState.set("writing");
    noteState.activeNoteId.set(null);
    text.set("");
  }, [text]);

  const switchEditorState = useCallback(() => {
    if (editorState === "writing") {
      globalState$.editorState.set("viewing");
      return;
    }
    globalState$.editorState.set("writing");
  }, [editorState]);


  return (
    <>
      {editorState === "writing" ? (
        <TextArea
          onChange={handleEditorInput}
          value={text.get()!}
          ref={editorRef}
          className="w-full h-full text-sm bg-slate-50 rounded-md dark:bg-slate-700"
        />
      ) : (
        <MarkdownView content={text.get()!} />
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
                ? "Switch to Preview"
                : "Switch to Editor"
            }
          >
            <IconButton
              onClick={switchEditorState}
              variant="outline"
              radius="full"
              size="2"
              className="cursor-pointer"
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
              className="cursor-pointer"
            >
              <DownloadSimple size={15} />
            </IconButton>
          </Tooltip>
          <Tooltip content="New note">
            <IconButton
              radius="full"
              onClick={handleNewNoteClick}
              variant="outline"
              className="cursor-pointer"
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
