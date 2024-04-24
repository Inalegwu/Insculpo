import { Flex, Text } from "@radix-ui/themes";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/firstlaunch")({
  component: FirstLaunch,
});

function FirstLaunch() {
  return (
    <Flex
      width="100%"
      height="100%"
      align="center"
      justify="center"
      direction="column"
    >
      <Text>Welcome to</Text>
    </Flex>
  );
}
