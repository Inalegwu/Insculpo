import {
  ArrowsCounterClockwise,
  KeyReturn,
  Palette,
} from "@phosphor-icons/react";
import { Box, Flex, Tabs, Text } from "@radix-ui/themes";
import { Appearance, Shortcuts, Sync } from "@src/web/components/settings";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/settings")({
  component: Settings,
});

function Settings() {
  return (
    <Flex width="100%" height="100%" className="px-2 py-2">
      <Tabs.Root className="w-full h-full">
        <Tabs.List defaultValue="sync">
          <Tabs.Trigger value="sync">
            <Flex align="center" gap="2">
              <ArrowsCounterClockwise />
              <Text>Sync</Text>
            </Flex>
          </Tabs.Trigger>
          <Tabs.Trigger value="appearance">
            <Flex align="center" gap="2">
              <Palette />
              <Text>Appearance</Text>
            </Flex>
          </Tabs.Trigger>
          <Tabs.Trigger value="shortcuts">
            <Flex align="center" gap="2">
              <KeyReturn />
              <Text>Shortcuts</Text>
            </Flex>
          </Tabs.Trigger>
        </Tabs.List>
        <Box p="2" width="100%" height="100%">
          <Tabs.Content value="sync">
            <Sync />
          </Tabs.Content>
          <Tabs.Content value="appearance">
            <Appearance />
          </Tabs.Content>
          <Tabs.Content value="shortcuts">
            <Shortcuts />
          </Tabs.Content>
        </Box>
      </Tabs.Root>
    </Flex>
  );
}
