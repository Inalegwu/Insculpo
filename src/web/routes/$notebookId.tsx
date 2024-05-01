import { Button, Dialog, Flex, Text } from "@radix-ui/themes";
import t from "@src/shared/config";
import { formatTextForSidebar } from "@src/shared/utils";
import { createFileRoute } from "@tanstack/react-router";
import { FiPlus } from "react-icons/fi";
import { FlatList } from "../components";

export const Route = createFileRoute("/$notebookId")({
  component: Notebook,
});

function Notebook() {
  const params = Route.useParams();
  const utils = t.useUtils();

  const { data: notebook } = t.notebooks.getNotebook.useQuery({
    notebookId: params.notebookId,
  });

  const { data: notes } = t.notes.getNotes.useQuery();

  const { mutate: addToNotebook } = t.notebooks.addNoteToCollection.useMutation(
    {
      onSuccess: () => {
        utils.notebooks.getNotebook.invalidate();
      },
    },
  );

  return (
    <Flex direction="column" width="100%" height="100%" className="px-25 py-20">
      <Text size="6" weight="bold">
        {notebook?.name}
      </Text>
      <FlatList
        data={notebook?.notes || []}
        listHeaderComponent={() => (
          <Flex width="100%" className="py-4" align="center" justify="start">
            <Dialog.Root>
              <Dialog.Trigger>
                <Button variant="soft" color="iris">
                  <Flex align="center" gap="2">
                    <Text weight="light" size="1">
                      Add Note
                    </Text>
                    <FiPlus />
                  </Flex>
                </Button>
              </Dialog.Trigger>
              <Dialog.Content>
                <FlatList
                  data={notes || []}
                  listHeaderComponent={() => (
                    <Flex className="py-4">
                      <Text weight="regular" size="3">
                        My Notes
                      </Text>
                    </Flex>
                  )}
                  renderItem={({ item }) => (
                    <Flex
                      onClick={() =>
                        addToNotebook({
                          noteId: item.id,
                          collectionId: params.notebookId,
                        })
                      }
                      align="center"
                      justify="start"
                    >
                      <Text weight="regular" size="2">
                        {item.name}
                      </Text>
                    </Flex>
                  )}
                />
              </Dialog.Content>
            </Dialog.Root>
          </Flex>
        )}
        renderItem={({ item }) => (
          <Flex width="100%" className="py-4">
            <Flex direction="column" align="start" gap="1">
              <Text className="text-[12px]" color="iris">
                {item.name}
              </Text>
              <Text className="text-[11px] text-gray-400">
                {formatTextForSidebar(item.content).slice(0, 40)}
              </Text>
            </Flex>
          </Flex>
        )}
      />
    </Flex>
  );
}
