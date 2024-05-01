import { ContextMenu, Flex, Text } from "@radix-ui/themes";
import t from "@src/shared/config";
import type { NoteBook } from "@src/shared/types";
import { useNavigate } from "@tanstack/react-router";
import { FiTrash } from "react-icons/fi";

type Props = {
  notebook: NoteBook;
};

export default function Notebook({ notebook }: Props) {
  const utils = t.useUtils();
  const nav = useNavigate();
  const { mutate: deleteNotebook } = t.notebooks.deleteNotebook.useMutation({
    onSuccess: () => {
      utils.notebooks.getNotebooks.invalidate();
    },
  });

  return (
    <ContextMenu.Root>
      <ContextMenu.Trigger className="cursor-pointer">
        <Flex
          direction="column"
          onClick={() =>
            nav({
              to: "/$notebookId",
              params: {
                notebookId: notebook.id,
              },
            })
          }
          align="end"
          justify="center"
          className="py-2"
        >
          <Text weight="bold" className="text-[11.5px]" color="iris">
            {notebook.name}
          </Text>
          <Text className="text-[10px] text-gray-400">
            {notebook.notes.length} Notes
          </Text>
        </Flex>
      </ContextMenu.Trigger>
      <ContextMenu.Content size="1" variant="soft">
        <ContextMenu.Item
          color="red"
          onClick={() => deleteNotebook({ bookId: notebook.id })}
        >
          <Flex gap="1" align="center">
            <FiTrash />
            <Text size="1">Delete Notebook</Text>
          </Flex>
        </ContextMenu.Item>
      </ContextMenu.Content>
    </ContextMenu.Root>
  );
}
