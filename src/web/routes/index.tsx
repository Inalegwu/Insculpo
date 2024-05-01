import { useObservable } from "@legendapp/state/react";
import { Flex, IconButton, TextArea, Tooltip } from "@radix-ui/themes";
import t from "@shared/config";
import { MarkdownView } from "@src/web/components";
import {
  useDebounce,
  useEditor,
  useInterval,
  useTimeout,
  useWindow,
} from "@src/web/hooks";
import { globalState$ } from "@src/web/state";
import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import type React from "react";
import { useCallback } from "react";
import toast from "react-hot-toast";
import * as Feather from "react-icons/fi";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const utils = t.useUtils();
  const toolbar = useObservable(false);

  const [text, activeNoteId] = useEditor();

  const editorState = globalState$.editorState.get();

  const isDarkMode = globalState$.colorMode.get() === "dark";

  useTimeout(() => {
    if (toolbar.get()) {
      toolbar.set(false);
    }
  }, 2000);

  useInterval(() => {
    if (text.get() === "") return;

    saveNote({ noteId: activeNoteId.get(), content: text.get() });
  }, 2000);

  const { mutate: saveNote } = t.notes.saveNote.useMutation({
    onSuccess: (d) => {
      if (d) {
        utils.notes.getNotes.invalidate();
        activeNoteId.set(d.id);
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
      noteId: activeNoteId.get(),
    },
    {
      onSuccess: (d) => {
        if (d === null) return;
        activeNoteId.set(d?.id);
        text.set(d?.content);
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
    toolbar.set(true);
  }, 50);

  useWindow("mousemove", handleMouseMove);

  const handleNewNoteClick = useCallback(() => {
    globalState$.editorState.set("writing");
    activeNoteId.set(null);
    text.set("");
  }, [text, activeNoteId]);

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
          className="w-full h-full text-sm  rounded-md line-height-loose font-[Recursive]"
        />
      ) : (
        <MarkdownView content={text.get()!} />
      )}
      {/* editor actions */}
      <motion.div
        initial={false}
        animate={{
          opacity: toolbar.get() ? 1 : 0,
          display: toolbar.get() ? "flex" : "none",
        }}
        style={{ position: "absolute" }}
        className="absolute bottom-2 left-0"
      >
        <Flex
          align="center"
          direction="column"
          gap="2"
          className="px-4 py-2 rounded-md"
        >
          {/* change editor state */}
          <Tooltip
            content={
              globalState$.editorState.get() === "writing"
                ? "Switch to Preview"
                : "Switch to Editor"
            }
          >
            <IconButton
              onClick={switchEditorState}
              variant="soft"
              radius="full"
              size="3"
              className="cursor-pointer"
              color={isDarkMode ? "gray" : "iris"}
            >
              <Feather.FiEye size={13} />
            </IconButton>
          </Tooltip>
          {/* save note to device */}
          <Tooltip content="Export note">
            <IconButton
              onClick={() => dumpNote({ noteId: activeNoteId.get() })}
              variant="soft"
              radius="full"
              size="3"
              className="cursor-pointer"
              color={isDarkMode ? "gray" : "iris"}
            >
              <Feather.FiDownload size={13} />
            </IconButton>
          </Tooltip>
          {/* create a new note */}
          <Tooltip content="New note">
            <IconButton
              radius="full"
              onClick={handleNewNoteClick}
              variant="soft"
              className="cursor-pointer"
              size="3"
              color={isDarkMode ? "gray" : "iris"}
            >
              <Feather.FiPlus size={13} />
            </IconButton>
          </Tooltip>
        </Flex>
      </motion.div>
    </>
  );
}
