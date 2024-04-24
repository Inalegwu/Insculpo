import { GithubLogo } from "@phosphor-icons/react";
import {
  Flex,
  Heading,
  IconButton,
  ScrollArea,
  Text,
  Tooltip,
} from "@radix-ui/themes";
import image1 from "@src/assets/images/Screenshot (2).png";
import image from "@src/assets/images/Screenshot (3).png";
import t from "@src/shared/config";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/about")({
  component: About,
});

function About() {
  const { mutate: openLink } = t.links.openExternal.useMutation();

  return (
    <ScrollArea
      type="always"
      scrollbars="vertical"
      size="1"
      className="px-10 py-8 overflow-y-scroll w-full h-full flex flex-col items-start justify-center gap-4 rounded-lg border-1 border-solid border-gray-400/50 px-25 py-20 rounded-md overflow-y-scroll dark:bg-slate-700 dark:border-gray-500/30"
    >
      <Flex direction="column" align="start" className="mt-4 mb-4">
        <Heading size="7">Insculpo</Heading>
        <Text size="1" className="text-gray-400">
          Focus on taking notes , not organizing them
        </Text>
      </Flex>
      <Flex className="mb-4 mt-4">
        <Text size="2">
          Insculpo is a markdown based note-taking app focused on taking notes
          first and organizing them later by allowing you to get to the point of
          the note first and only organizing when your thoughts are crystal
          clear by removing the fatigue of the inital note taking process and
          simply giving you a blank notepad at the start.
        </Text>{" "}
      </Flex>
      <img
        src={image}
        className="w-full shadow-lg rounded-lg mt-4 mb-4 resize-cover"
        alt="notepad preview"
      />
      <Flex className="mb-4 mt-4">
        <Text size="2">
          When you're done writing , you can open your sidebar to view all your
          notes in one place like one giant notebook,with all your thoughts
          close together.By not trying to be a second brain that does all all
          the things,Insculpo focuses on letting you do one thing,and doing that
          one thing very well and consistently every single time.
        </Text>
      </Flex>
      <img
        src={image1}
        className="w-full shadow-lg rounded-lg mt-4 mb-4 resize-cover"
        alt="sidebar preview"
      />
      <Flex className="mb-4 mt-4">
        <Text size="2" className="italic">
          'Cause sometimes you just want to write y'know
        </Text>
      </Flex>
      <Flex width="100%" className="mt-4 mb-4" align="center" justify="center">
        <Tooltip content="See Insculpo on Github">
          <IconButton
            onClick={() =>
              openLink({ link: "https://github.com/Inalegwu/Insculpo" })
            }
            size="4"
            className="cursor-pointer"
            variant="soft"
            radius="full"
          >
            <GithubLogo size={13} />
          </IconButton>
        </Tooltip>
      </Flex>
    </ScrollArea>
  );
}
