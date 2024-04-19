import { X } from "@phosphor-icons/react";
import { Box, Button, Flex } from "@radix-ui/themes";
import { globalState$ } from "../state";

export default function Settings() {
  return (
    <Flex
      align="center"
      justify="center"
      className="absolute z-40 w-full h-full"
    >
      <Box className="w-4/6 h-4/6 bg-white shadow-2xl rounded-lg px-2 py-2">
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
      </Box>
    </Flex>
  );
}
