import { Flex, Heading, Text } from "@radix-ui/themes";
import { Link } from "@tanstack/react-router";

export default function NotFoundRoute() {
  return (
    <Flex
      width="100%"
      height="100%"
      direction="column"
      align="center"
      justify="center"
    >
      <Heading size="4">Sorry , that page doesn't exist</Heading>
      <Link
        href="/"
        className="px-2 py-4 rounded-md bg-indigo-500 text-indigo-700"
      >
        <Text size="2">Go Home</Text>
      </Link>
    </Flex>
  );
}
