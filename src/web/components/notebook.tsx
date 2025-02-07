import { ContextMenu, Flex, Text } from "@radix-ui/themes";
import t from "@src/shared/config";
import { useNavigate } from "@tanstack/react-router";
import Icon from "./icon";

type Props = {
  notebook: any;
};

export default function Notebook({ notebook }: Props) {
  const utils = t.useUtils();
  const nav = useNavigate();
 

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
          onClick={() => console.log("hi there...")}
        >
          <Flex gap="1" align="center">
            <Icon name="Trash" />
            <Text size="1">Delete Notebook</Text>
          </Flex>
        </ContextMenu.Item>
      </ContextMenu.Content>
    </ContextMenu.Root>
  );
}
