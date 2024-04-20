import { Flex } from "@radix-ui/themes";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/about")({
  component: About,
});

function About() {
  return (
    <Flex width="100%" height="100%">
      content
    </Flex>
  );
}
