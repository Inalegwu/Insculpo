import { Flex, Heading } from "@radix-ui/themes";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <Flex className="w-full h-full p-2">
      <Heading>Insculpto</Heading>
      content
    </Flex>
  );
}
