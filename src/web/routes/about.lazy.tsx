import { GithubLogo } from "@phosphor-icons/react";
import { Flex, Heading, IconButton, ScrollArea, Text, Tooltip } from "@radix-ui/themes";
import t from "@src/shared/config";
import { createLazyFileRoute } from "@tanstack/react-router";
import { Link } from "../components";
import image from "@src/assets/images/Screenshot (3).png";
import image1 from "@src/assets/images/Screenshot (2).png";

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
      className="px-10 py-10 overflow-y-scroll w-full h-full flex flex-col items-start justify-center gap-4  rounded-lg"
    >
      <Flex direction="column" align="start" className="mt-4 mb-4">
        <Heading size="7">Insculpo</Heading>
        <Text size="1" className="text-gray-400">
          Focus on taking notes , not organizing them
        </Text>
      </Flex>
      <Flex className="mb-4 mt-4">
        <Text size="2">Insculpo is a markdown based note-taking app focused on taking notes first
          and organizing them later by allowing you to get to the point of the note first
          and only organizing when your thoughts are crystal clear by removing the fatigue
          of the inital note taking process and simply giving you a blank notepad at the start.
        </Text> </Flex>
      <img src={image} className="w-full shadow-lg rounded-lg mt-4 mb-4 resize-cover" alt="notepad preview" />
      <Flex className="mb-4 mt-4">
        <Text size="2">When you're done writing , you can open your sidebar to view all your notes in one place
          like one giant notebook,with all your thoughts close together.By not trying to be a second brain that does all
          all the things,Insculpo focuses on letting you do one thing,and doing that one thing very well and consistently
          every single time.
        </Text>
      </Flex>
      <img src={image1} className="w-full shadow-lg rounded-lg mt-4 mb-4 resize-cover" alt="sidebar preview" />
      <Flex className="mb-4 mt-4">
        <Text size="2" className="italic">'Cause sometimes you just want to write y'know</Text>
      </Flex>
      <Text size="2" className="mb-4 mt-4">
        If you find Insculpo interesting,kindly star it on github ,it would
        mean a lot to me and if you want to use it,you could clone the repo
        and build it yourself although it would be nice if you{" "}
        <Link href="https://discord.gg/JSbC7EammN">contacted me</Link> first
        before going ahead,but it's fine regardless
      </Text>
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
