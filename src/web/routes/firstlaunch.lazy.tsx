import { Button, Flex, Text } from "@radix-ui/themes";
import { createLazyFileRoute, useNavigate } from "@tanstack/react-router";
import { useCallback } from "react";
import { v4 } from "uuid";
import { globalState$ } from "../state";

export const Route = createLazyFileRoute("/firstlaunch")({
  component: FirstLaunch,
});

function FirstLaunch() {
  const nav = useNavigate();

  const getStartedClicked = useCallback(() => {
    globalState$.firstLaunch.set(false);
    globalState$.appId.set(v4());
    nav({
      to: "/",
    });
  }, [nav]);

  return (
    <Flex
      width="100%"
      height="100%"
      align="center"
      justify="center"
      direction="column"
      gap="3"
      className="px-30 py-30"
    >
      <Flex
        direction="column"
        width="100%"
        align="start"
        justify="center"
        gap="1"
      >
        <Text size="8" weight="medium">
          Welcome to
        </Text>
        <Text size="9" weight="bold" color="iris">
          Insculpo
        </Text>
        <Text size="6" weight="medium" color="gray">
          Your notebook with Superpowers
        </Text>
      </Flex>
      <Flex width="100%" align="center" justify="start">
        <Button
          onClick={getStartedClicked}
          variant="surface"
          size="4"
          className="cursor-pointer"
        >
          <Text>Get Started</Text>
        </Button>
      </Flex>
    </Flex>
  );
}
