import { useObservable } from "@legendapp/state/react";
import { Flex, TextArea } from "@radix-ui/themes";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/")({
  component: Index,
});

function Index() {
  const text = useObservable("");

  return (
    <Flex className="w-full h-full">
      <TextArea
        value={text.get()}
        onChange={(e) => text.set(e.currentTarget.value)}
        className="w-full h-full outline-indigo-100"
      />
      <Flex className="absolute z-10 bottom-2 rounded-full right-2 px-3 py-3" />
    </Flex>
  );
}
