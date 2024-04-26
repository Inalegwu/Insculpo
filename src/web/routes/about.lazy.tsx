import { Flex, Heading, Text } from "@radix-ui/themes";
import { createLazyFileRoute } from "@tanstack/react-router";
import * as Phosphor from "react-icons/pi";
import { Link } from "../components";

export const Route = createLazyFileRoute("/about")({
  component: About,
});

function About() {
  return (
    <Flex
      align="start"
      justify="center"
      direction="column"
      width="100%"
      height="100%"
      gap="2"
      className="px-25 py-20 "
    >
      <Flex direction="column" align="start" className="mt-4">
        <Heading size="9">Insculpo</Heading>
        <Text size="5" className="text-gray-400 dark:text-gray-500">
          Your notebook, with superpowers
        </Text>
      </Flex>
      <Text size="2" className="text-gray-400 mt-2 mb-2">
        Made with 🖤 by{" "}
        <Link href="" className="ml-1 mr-1">
          Disgruntled Devs
        </Link>{" "}
        , part of the <Link href="">Officina</Link> Suite
      </Text>
      <Text size="1" color="gray">
        2024 <Phosphor.PiCopyright size={13} /> Disgruntled Devs
      </Text>
    </Flex>
  );
}
