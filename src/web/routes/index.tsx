import { Flex, Text } from "@radix-ui/themes";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <Flex className="px-2 py-2">
      <Text size="5">Welcome Back</Text>
    </Flex>
  );
}
