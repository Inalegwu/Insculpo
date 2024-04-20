import { Flex, Switch, Text } from "@radix-ui/themes";

export default function Sync() {
  return (
    <Flex direction="column" width="100%" height="100%" className="py-2">
      {/* turn syncing on or off */}
      <Flex align="center" justify="between" width="100%" className="py-3">
        <Flex direction="column" align="start">
          <Text color="iris" className="text-[11.5px]">
            Allow Syncing
          </Text>
          <Text className="text-[11px] text-gray-400">
            have access to all your notes , anywhere
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
            You don't have to use our sync server , you can bring yours
          </Text>
        </Flex>
        <Switch defaultChecked />
      </Flex>
    </Flex>
  );
}
