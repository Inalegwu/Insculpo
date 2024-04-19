import { X } from "@phosphor-icons/react";
import { Button, Flex, Text } from "@radix-ui/themes";
import t from "@src/shared/config";
import { globalState$ } from "../state";

export default function Settings() {
  const { data } = t.version.useQuery();

  return (
    <Flex
      align="center"
      justify="center"
      className="absolute z-40 w-full h-full"
    >
      <Flex
        direction="column"
        className="w-4/6 h-4/6 bg-white shadow-2xl rounded-lg px-2 py-2"
      >
        <Flex align="center" justify="end" width="100%" className="px-2 py-1">
          <Button
            onClick={() => globalState$.settingsVisible.set(false)}
            variant="ghost"
            color="red"
            radius="full"
            className="text-red-500 w-3 h-5"
          >
            <X size={15} />
          </Button>
        </Flex>
        <Flex grow="1">settings content</Flex>
        <Flex align="center" justify="center">
          <Text className="text-gray-400 text-[11px]">{data}</Text>
        </Flex>
      </Flex>
    </Flex>
  );
}
