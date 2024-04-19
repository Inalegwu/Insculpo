import { Flex, Text } from "@radix-ui/themes";
import { Link, createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/firstlaunch")({
  component: FirstLaunch,
});

function FirstLaunch() {
  return (
    <Flex
      direction="column"
      width="100%"
      height="100%"
      align="center"
      justify="center"
    >
      <Text size="9">Insculpo</Text>
      <Text size="7" className="text-gray-400">
        The simplest note-taking app there is
      </Text>
      <Link to="/">Get Started</Link>
    </Flex>
  );
}
