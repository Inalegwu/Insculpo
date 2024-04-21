import { Download, Trash } from "@phosphor-icons/react";
import { ContextMenu, Flex, Text } from "@radix-ui/themes";
import t from "@src/shared/config";
import type { Note } from "@src/shared/types";
import { formatTextForSidebar } from "@src/shared/utils";
import { useNavigate, useRouterState } from "@tanstack/react-router";
import { useCallback } from "react";
import toast from "react-hot-toast";
import { useEditor } from "../hooks";
import { noteState } from "../state";

type DocumentProps = {
  doc?: PouchDB.Core.ExistingDocument<Note>;
};

export default function Document({ doc }: DocumentProps) {
  const utils = t.useUtils();
  const routeState = useRouterState();
  const nav = useNavigate();
  const [editorRef] = useEditor();

  const { mutate: dumpNote } = t.notes.dumpNote.useMutation({
    onSuccess: () => {
      toast.success("Note exported successfully");
    },
    onError: (e) => {
      toast.error("Couldn't export note");
    },
  });

  const { mutate: deleteNote } = t.notes.deleteNote.useMutation({
    onSuccess: (_, v) => {
      utils.notes.invalidate();
      noteState.activeNoteId.set(null);
      if (noteState.activeNoteId.get() === v.noteId) {
        noteState.activeNoteId.set(null);
      }
    },
    onError: (e) => {
      toast.error(e.message);
    },
  });

  const handleNoteClick = useCallback(
    (id: string) => {
      noteState.activeNoteId.set(id);
      editorRef.current?.focus();
      if (routeState.location.pathname !== "/") {
        nav({
          to: "/",
        });
      }
    },
    [routeState, nav, editorRef],
  );

  return (
    <ContextMenu.Root>
      <ContextMenu.Trigger className="cursor-pointer">
        <Flex
          width="100%"
          className="px-2 py-2 rounded-md"
          direction="column"
          align="end"
          justify="center"
          onClick={() => handleNoteClick(doc?._id!)}
        >
          <Text color="iris" weight="bold" className="text-[11px]">
            {doc?.name?.slice(0, 28)}
          </Text>
          <Text
            className="text-[10.5px] text-gray-400 font-medium"
            color="gray"
          >
            {formatTextForSidebar(doc?.body?.slice(0, 30) || "")}
          </Text>
        </Flex>
      </ContextMenu.Trigger>
      <ContextMenu.Content size="1" variant="soft">
        <ContextMenu.Item onClick={() => dumpNote({ noteId: doc?._id || "" })}>
          <Flex gap="1" align="center">
            <Download />
            <Text size="1">Export Note</Text>
          </Flex>
        </ContextMenu.Item>
        <ContextMenu.Item
          color="red"
          onClick={() =>
            deleteNote({
              noteId: doc?._id!,
              rev: doc?._rev!,
            })
          }
        >
          <Flex gap="1" align="center">
            <Trash />
            <Text size="1">Delete Note</Text>
          </Flex>
        </ContextMenu.Item>
      </ContextMenu.Content>
    </ContextMenu.Root>
  );
}
