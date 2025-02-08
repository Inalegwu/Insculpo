import { Code, Flex, Heading, Text } from "@radix-ui/themes";
import type { ErrorComponentProps } from "@tanstack/react-router";

export default function ErrorComponent(props: ErrorComponentProps) {
  if (!import.meta.env.DEV) {
    return (
      <Flex direction="column" align="center" justify="center">
        <Heading size="5">Something went wrong</Heading>
        <Text size="3" color="gray">
          The error has been reported. please restart immediately
        </Text>
        <Text>
          if the issue persists, please contact support with your issue
        </Text>
      </Flex>
    );
  }

  return (
    <Flex
      width="100%"
      height="100%"
      direction="column"
      align="center"
      justify="start"
      className="px-10 py-10 bg-red-100"
    >
      <Text size="5" color="tomato">
        Something went wrong
      </Text>
      <Text>{props.error.message}</Text>
      <Code size="1" variant="soft">
        {props.error.stack}
      </Code>
    </Flex>
  );
}
