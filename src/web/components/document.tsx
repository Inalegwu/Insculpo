import { Download, Trash } from "@phosphor-icons/react";
import { ContextMenu, Flex, Text } from "@radix-ui/themes";
import t from "@src/shared/config";
import type { Note } from "@src/shared/types";
import { formatTextForSidebar } from "@src/shared/utils";
import { noteState } from "@src/web/state";
import { useNavigate, useRouterState } from "@tanstack/react-router";
import { useCallback } from "react";
import toast from "react-hot-toast";

type DocumentProps = {
  doc?: PouchDB.Core.ExistingDocument<Note>;
};

export default function Document({ doc }: DocumentProps) {
  const utils = t.useUtils();
  const routeState = useRouterState();
  const nav = useNavigate();

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
      if (routeState.location.pathname !== "/") {
        nav({
          to: "/",
        });
      }
    },
    [routeState, nav],
  );

  return (
    <ContextMenu.Root>
      <ContextMenu.Trigger className="cursor-pointer">
        <Flex
          width="100%"
          align="end"
          justify="between"
          onClick={() => handleNoteClick(doc?._id!)}
          className="py-3 rounded-md"
        >
          {noteState.activeNoteId.get() === doc?._id ? (
            <Flex className="h-[1vh] w-[1vh] bg-indigo-500/30 rounded-full transition transition-duration-[10]" />
          ) : (
            <Flex grow="1" />
          )}
          <Flex direction="column" align="end" justify="center">
            <Text color="iris" weight="bold" className="text-[11px]">
              {doc?.name?.slice(0, 28)}
            </Text>
            <Text className="text-[9.7px] text-gray-400 font-medium">
              {formatTextForSidebar(doc?.body?.slice(0, 30) || "")}
            </Text>
          </Flex>
        </Flex>
      </ContextMenu.Trigger>
      <ContextMenu.Content
        size="1"
        variant="soft"
        className="dark:bg-slate-700"
      >
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
