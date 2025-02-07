import { Flex, Text } from "@radix-ui/themes";
import t from "@src/shared/config";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/$notebookId")({
  component: Notebook,
});

function Notebook() {
  const params = Route.useParams();
  const utils = t.useUtils();


  return (
    <Flex direction="column" width="100%" height="100%" className="px-25 py-20">
      <Text size="6" weight="bold">
        ""
      </Text>
     
    </Flex>
  );
}
