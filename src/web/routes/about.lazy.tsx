import { Flex, Heading, ScrollArea, Text } from "@radix-ui/themes";
import { createLazyFileRoute } from "@tanstack/react-router";
import { Link } from "../components";

export const Route = createLazyFileRoute("/about")({
  component: About,
});

function About() {
  return (
    <ScrollArea
      type="scroll"
      scrollbars="vertical"
      size="1"
      className="w-full h-full flex bg-slate-50 flex-col gap-4 rounded-lg border-1 border-solid border-gray-400/50 px-25 py-20 rounded-md dark:bg-slate-700 dark:border-gray-500/30"
    >
      <Flex direction="column" align="start" className="mt-4 mb-4">
        <Heading size="9">Insculpo</Heading>
        <Text size="5" className="text-gray-400">
          Your notebook, with superpowers
        </Text>
      </Flex>
      <Flex className="mb-4 mt-4">
        <Text size="3" weight="light">
          Insculpo is a markdown based note-taking app focused on taking notes
          first and organizing them later by allowing you to get to the point of
          the note first and only organizing when your thoughts are crystal
          clear by removing the fatigue of the inital note taking process and
          simply giving you a blank notepad at the start.
        </Text>{" "}
      </Flex>
      <Flex className="mb-4 mt-4">
        <Text size="3" weight="light">
          When you're done writing , you can open your sidebar to view all your
          notes in one place like one giant notebook,with all your thoughts
          close together.
        </Text>
      </Flex>
      <Flex className="mb-4 mt-4">
        <Text size="3" weight="light">
          By not trying to be a second brain that does all the things,
          <Text color="iris" className="ml-1 mr-1">
            Insculpo
          </Text>
          focuses on letting you do one thing,and doing that one thing very well
          and consistently every single time.
        </Text>
      </Flex>
      <Flex className="mt-4 mb-4">
        <Text size="3" className="text-gray-400">
          Made with 🖤 by{" "}
          <Link href="https://google.com" className="ml-1 mr-1">
            Disgruntled Devs
          </Link>
        </Text>
      </Flex>
    </ScrollArea>
  );
}
