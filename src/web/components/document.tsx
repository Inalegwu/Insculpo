import { ContextMenu, Flex, Text } from "@radix-ui/themes";
import t from "@src/shared/config";
import type { Note } from "@src/shared/types";
import { formatTextForSidebar } from "@src/shared/utils";
import { useNavigate, useRouterState } from "@tanstack/react-router";
import { useCallback } from "react";
import toast from "react-hot-toast";
import { FiDownload, FiTrash } from "react-icons/fi";
import { useEditor } from "../hooks";

type DocumentProps = {
  doc: Note;
};

export default function Document({ doc }: DocumentProps) {
  const utils = t.useUtils();
  const routeState = useRouterState();
  const nav = useNavigate();
  const [_, activeNoteId] = useEditor();

  const { mutate: dumpNote } = t.notes.dumpNote.useMutation({
    onSuccess: () => {
      toast.success("Note exported successfully");
    },
    onError: (e) => {
      console.error(e);
      toast.error("Couldn't export note");
    },
  });

  const { mutate: deleteNote } = t.notes.deleteNote.useMutation({
    onSuccess: (_, v) => {
      utils.notes.invalidate();
      if (activeNoteId.get() === v.noteId) {
        activeNoteId.set(null);
      }
    },
    onError: (e) => {
      console.log(e);
      toast.error("Couldn't delete right now");
    },
  });

  const handleNoteClick = useCallback(
    (id: string) => {
      activeNoteId.set(id);
      if (routeState.location.pathname !== "/") {
        nav({
          to: "/",
        });
      }
    },
    [routeState, nav, activeNoteId],
  );

  return (
    <ContextMenu.Root>
      <ContextMenu.Trigger className="cursor-pointer">
        <Flex
          width="100%"
          align="end"
          justify="between"
          onClick={() => handleNoteClick(doc.id)}
          className="py-3 rounded-md"
        >
          {activeNoteId.get() === doc.id ? (
            <Flex className="h-[1vh] w-[1vh] bg-indigo-500/30 rounded-full transition transition-duration-[10]" />
          ) : (
            <Flex grow="1" />
          )}
          <Flex direction="column" align="end" justify="center">
            <Text color="iris" weight="bold" className="text-[11px] font-bold">
              {doc.name?.slice(0, 28)}
            </Text>
            <Text className="text-[10px] text-gray-400 font-light">
              {formatTextForSidebar(doc.content?.slice(0, 30) || "")}
            </Text>
          </Flex>
        </Flex>
      </ContextMenu.Trigger>
      <ContextMenu.Content size="1" variant="soft" className="dark:bg-dark-9">
        <ContextMenu.Item onClick={() => dumpNote({ noteId: doc.id || "" })}>
          <Flex gap="1" align="center">
            <FiDownload />
            <Text size="1">Export Note</Text>
          </Flex>
        </ContextMenu.Item>
        <ContextMenu.Item
          color="red"
          onClick={() =>
            deleteNote({
              noteId: doc.id,
            })
          }
        >
          <Flex gap="1" align="center">
            <FiTrash />
            <Text size="1">Delete Note</Text>
          </Flex>
        </ContextMenu.Item>
      </ContextMenu.Content>
    </ContextMenu.Root>
  );
}
