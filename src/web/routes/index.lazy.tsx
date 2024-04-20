import { useObservable } from "@legendapp/state/react";
import { DownloadSimple, Eye } from "@phosphor-icons/react";
import { Flex, IconButton, TextArea } from "@radix-ui/themes";
import t from "@shared/config";
import { globalState$, noteState } from "@src/web/state";
import { createLazyFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import type React from "react";
import { useCallback, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkToc from "remark-toc";

export const Route = createLazyFileRoute("/")({
  component: Index,
});

function Index() {
  const utils = t.useUtils();
  const text = useObservable("");
  const toolbar = useObservable(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const editorState = globalState$.editorState.get();

  useEffect(() => {
    if (noteState.activeNoteId.get() !== null) {
      inputRef.current?.focus();
    }

    const timeout = setTimeout(() => {
      if (toolbar.get()) {
        toolbar.set(false);
      }
    }, 4000);

    return () => {
      clearTimeout(timeout);
    };
  }, [toolbar]);

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
  }, [saveNote, text]);

  const switchEditorState = useCallback(() => {
    console.log(editorState);
    if (editorState === "writing") {
      globalState$.editorState.set("viewing");
      return;
    }
    globalState$.editorState.set("writing");
  }, [editorState]);

  return (
    <Flex
      onMouseMove={handleMouseMove}
      direction="column"
      gap="2"
      className="w-full h-full bg-slate-50"
    >
      {editorState === "writing" ? (
        <TextArea
          value={text.get()}
          onChange={handleEditorInput}
          ref={inputRef}
          className="w-full h-full text-sm outline-indigo-100 rounded-md"
          onBlur={handleBlur}
        />
      ) : (
        <Markdown
          // biome-ignore lint/correctness/noChildrenProp: I kind of prefer this way for this
          children={text.get()}
          className="bg-white text-base w-full h-full border-1 border-solid border-gray-400/50 px-2 py-2 rounded-md"
          remarkPlugins={[remarkGfm, remarkToc]}
        />
      )}
      {/* change from preview mode to non-preview mode */}
      <motion.div
        animate={{ opacity: toolbar.get() ? 1 : 0 }}
        style={{ position: "absolute" }}
        className="absolute bottom-2 left-0"
      >
        <Flex align="center" gap="2" className="px-4 py-2 rounded-md">
          <IconButton
            onClick={switchEditorState}
            variant="outline"
            radius="full"
            size="2"
          >
            <Eye size={15} />
          </IconButton>
          <IconButton variant="outline" radius="full" size="2">
            <DownloadSimple size={15} />
          </IconButton>
        </Flex>
      </motion.div>
    </Flex>
  );
}
