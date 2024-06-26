import { Box, Flex, Tabs, Text } from "@radix-ui/themes";
import { Appearance, Shortcuts, Sync } from "@src/web/components/settings";
import { createFileRoute } from "@tanstack/react-router";
import * as Phosphor from "react-icons/pi";

export const Route = createFileRoute("/settings")({
  component: Settings,
});

function Settings() {
  return (
    <Flex width="100%" height="100%" className="px-2 py-2">
      <Tabs.Root defaultValue="appearance" className="w-full h-full">
        <Tabs.List size="2">
          <Tabs.Trigger value="sync">
            <Flex align="center" gap="2">
              <Phosphor.PiArrowsCounterClockwise />
              <Text>Sync</Text>
            </Flex>
          </Tabs.Trigger>
          <Tabs.Trigger value="appearance">
            <Flex align="center" gap="2">
              <Phosphor.PiPalette />
              <Text>Appearance</Text>
            </Flex>
          </Tabs.Trigger>
          <Tabs.Trigger value="shortcuts">
            <Flex align="center" gap="2">
              <Phosphor.PiKeyReturn />
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
