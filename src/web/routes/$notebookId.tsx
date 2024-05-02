import { useObservable } from "@legendapp/state/react";
import { Button, ContextMenu, Dialog, Flex, Text } from "@radix-ui/themes";
import t from "@src/shared/config";
import { formatTextForSidebar } from "@src/shared/utils";
import {
  createFileRoute,
  useNavigate,
  useRouterState,
} from "@tanstack/react-router";
import moment from "moment";
import { useCallback, useRef } from "react";
import { FiMinus, FiPlus, FiTrash2 } from "react-icons/fi";
import { FlatList } from "../components";
import { useEditor } from "../hooks";

export const Route = createFileRoute("/$notebookId")({
  component: Notebook,
});

function Notebook() {
  const params = Route.useParams();
  const utils = t.useUtils();
  const nav = useNavigate();
  const routeState = useRouterState();

  const inputRef = useRef<HTMLInputElement>(null);

  const [_, activeNoteId] = useEditor();

  const state = useObservable<"editing" | "plain">("plain");

  const { data: notebook } = t.notebooks.getNotebook.useQuery({
    notebookId: params.notebookId,
  });

  const { mutate: deleteNote } = t.notes.deleteNote.useMutation({
    onSuccess: () => {
      utils.notes.getNotes.invalidate();
      utils.notebooks.getNotebook.invalidate();
      utils.notebooks.getNotebooks.invalidate();
    },
  });

  const { mutate: removeFromNotebook } =
    t.notebooks.removeNoteFromCollection.useMutation({
      onSuccess: () => {
        utils.notebooks.getNotebook.invalidate();
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
    [activeNoteId, nav, routeState],
  );

  return (
    <Flex direction="column" width="100%" height="100%" className="px-25 py-20">
      {state.get() === "editing" ? (
        <input
          value={notebook?.name}
          ref={inputRef}
          className="font-bold text-[23.3px] py-1 text-black placeholder-black border-none bg-transparent outline-none"
          onBlur={() => state.set("plain")}
        />
      ) : (
        <>
          <Text
            className="cursor-pointer hover:text-black/40 py-1"
            onClick={() => {
              state.set("editing");
              inputRef.current?.focus();
            }}
            size="6"
            weight="bold"
          >
            {notebook?.name}
          </Text>
        </>
      )}
      <FlatList
        data={
          notebook?.notes.filter((v) => v.collectionId === params.notebookId) ||
          []
        }
        listHeaderComponent={() => <Header notebookId={params.notebookId} />}
        renderItem={({ item, index }) => (
          <ContextMenu.Root key={index}>
            <ContextMenu.Trigger className="cursor-pointer">
              <Flex
                onClick={() => handleNoteClick(item.id)}
                width="100%"
                className="py-4"
                align="end"
                justify="between"
              >
                <Flex direction="column" align="start" gap="1">
                  <Text className="text-[12px]" weight="bold" color="iris">
                    {item.name}
                  </Text>
                  <Text className="text-[11px] text-gray-400">
                    {formatTextForSidebar(item.content).slice(0, 40)}
                  </Text>
                </Flex>
                <Text size="1" className="text-gray-400 text-[9px]">
                  {moment(item.dateUpdated).fromNow()}
                </Text>
              </Flex>
            </ContextMenu.Trigger>
            <ContextMenu.Content size="1" variant="soft">
              <ContextMenu.Item
                color="red"
                onClick={() => deleteNote({ noteId: item.id })}
              >
                <Flex align="center" justify="start" gap="1">
                  <FiTrash2 />
                  <Text>Delete Note</Text>
                </Flex>
              </ContextMenu.Item>
              <ContextMenu.Item
                color="red"
                onClick={() => removeFromNotebook({ noteId: item.id })}
              >
                <Flex gap="1" align="center" justify="start">
                  <FiMinus />
                  <Text>Remove from Notebook</Text>
                </Flex>
              </ContextMenu.Item>
            </ContextMenu.Content>
          </ContextMenu.Root>
        )}
      />
    </Flex>
  );
}

type Params = {
  notebookId: string;
};

function Header(params: Params) {
  const utils = t.useUtils();
  const { data: notes } = t.notes.getNotes.useQuery();

  const { mutate: addToNotebook } = t.notebooks.addNoteToCollection.useMutation(
    {
      onSuccess: () => {
        utils.notebooks.getNotebook.invalidate();
      },
    },
  );

  return (
    <Flex width="100%" className="py-4" align="center" justify="start">
      <Dialog.Root>
        <Dialog.Trigger>
          <Button size="1" variant="soft" color="iris">
            <Flex align="center" gap="2">
              <Text weight="light" className="text-[10px]">
                Add Note
              </Text>
              <FiPlus />
            </Flex>
          </Button>
        </Dialog.Trigger>
        <Dialog.Content className="px-5 py-2">
          <FlatList
            data={
              notes?.filter(
                (v) =>
                  v.collectionId !== params.notebookId &&
                  v.collectionId === null,
              ) || []
            }
            listHeaderComponent={() => (
              <Flex className="py-3">
                <Text weight="regular" size="4">
                  My Notes
                </Text>
              </Flex>
            )}
            renderItem={({ item, index }) => (
              <Flex
                onClick={() =>
                  addToNotebook({
                    noteId: item.id,
                    collectionId: params.notebookId,
                  })
                }
                key={index}
                align="center"
                className="py-4 cursor-pointer"
                justify="start"
              >
                <Text
                  color="iris"
                  className="underline"
                  weight="regular"
                  size="2"
                >
                  {item.name}
                </Text>
              </Flex>
            )}
          />
        </Dialog.Content>
      </Dialog.Root>
    </Flex>
  );
}
