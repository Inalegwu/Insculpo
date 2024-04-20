import { useObservable } from "@legendapp/state/react";
import { Button, DropdownMenu, Flex, Switch, Text } from "@radix-ui/themes";

export default function Sync() {
  const syncInterval = useObservable<"live" | "1Day">("live");

  return (
    <Flex direction="column" width="100%" height="100%" className="py-2">
      {/* turn syncing on or off */}
      <Flex align="center" justify="between" width="100%" className="py-3">
        <Flex direction="column" align="start">
          <Text color="iris" className="text-[11.5px]">
            Allow Syncing
          </Text>
          <Text className="text-[11px] text-gray-400">
            Have access to all your notes , anywhere
          </Text>
        </Flex>
        <Switch defaultChecked />
      </Flex>
      {/* change sync destination */}
      <Flex align="center" justify="between" width="100%" className="py-3">
        <Flex direction="column" align="start">
          <Text color="iris" className="text-[11.5px]">
            Change Sync Destination
          </Text>
          <Text className="text-[11px] text-gray-400">
            Your notes don't have to ever reach us , bring your own sync server.
          </Text>
        </Flex>
        <Switch defaultChecked />
      </Flex>
      {/* sync period */}
      <Flex align="center" justify="between" width="100%" className="py-3">
        <Flex direction="column" align="start">
          <Text color="iris" className="text-[11.5px]">
            Sync Interval
          </Text>
          <Text className="text-[11px] text-gray-400">
            You can get your notes now or later
          </Text>
        </Flex>
        <DropdownMenu.Root>
          <DropdownMenu.Trigger value={syncInterval.get()}>
            <Button
              variant="soft"
              size="1"
              className="flex flex-row items-center justify-center gap-2"
            >
              <Text>Live</Text>
            </Button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content
            size="1"
            onClick={() => syncInterval.set("live")}
          >
            <DropdownMenu.RadioItem value="live">Live</DropdownMenu.RadioItem>
            <DropdownMenu.RadioItem value="1Day">1Day</DropdownMenu.RadioItem>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      </Flex>
    </Flex>
  );
}
