import { GithubLogo } from "@phosphor-icons/react";
import { Flex, Heading, IconButton, Text, Tooltip } from "@radix-ui/themes";
import t from "@src/shared/config";
import { createLazyFileRoute } from "@tanstack/react-router";
import { Link } from "../components";

export const Route = createLazyFileRoute("/about")({
  component: About,
});

function About() {
  const { mutate: openLink } = t.links.openExternal.useMutation();

  return (
    <Flex
      width="100%"
      height="100%"
      direction="column"
      align="start"
      justify="center"
      gap="3"
      className="px-15 py-15 overflow-y-scroll overflow-x-hidden"
    >
      <Flex direction="column" align="start">
        <Heading size="7">Insculpto</Heading>
        <Text size="1" className="text-gray-400">
          Focus on taking notes , not organizing them
        </Text>
      </Flex>
      <Text align="left" size="2">
        Insculpo is a simplified note-taking app , focused on the note-taking
        experience and working backward from there.
      </Text>
      <Text size="2">
        Many note-taking apps today feature very complex UI's and data strucures
        and how to organize every little note you write.This works for a lot of
        people , but I'm not one of them , I don't exactly take notes , I
        scribble on any piece of paper or writing materials I have in front of
        me , I've even scribbled on a leaf.So the structure and organization of
        many of these notes apps , hinder me from getting to the point of my
        note and instead thinking of which folder it fits into and which tags
        will help me find it the fastest.
      </Text>
      <Text size="2">
        Insculpo is designed to rid me of that and instead allow me to focus on
        getting the note down first and only think of organzing it when the
        thoughts have been solidified.
      </Text>
      <Text size="2">
        It features a centralized and full-screen text area.This,is where the
        writing will take place.Then when you're done and finally ready to
        arrange things , you can open up the sidebar and do the arranging you
        need to,but only when you're sure everything is solid.
      </Text>
      <Text size="2">
        If you find the project interesting,please star the project , it would
        mean a lot to me and if you want to use it , it would be nice if you{" "}
        <Link href="https://discord.gg/JSbC7EammN">contacted me</Link> first
        before going ahead,but it's fine regardless
      </Text>
      <Flex width="100%" className="mt-2" align="center" justify="center">
        <Tooltip content="See Insculpo on Github">
          <IconButton
            onClick={() =>
              openLink({ link: "https://github.com/Inalegwu/Insculpo" })
            }
            className="cursor-pointer"
            variant="soft"
          >
            <GithubLogo size={13} />
          </IconButton>
        </Tooltip>
      </Flex>
    </Flex>
  );
}
