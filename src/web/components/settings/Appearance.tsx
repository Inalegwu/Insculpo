import { Flex, Switch, Text } from "@radix-ui/themes";
import { globalState$ } from "@src/web/state";
import { useCallback } from "react";

export default function Appearance() {
  const colorMode = globalState$.colorMode.get();

  const handleThemeChange = useCallback(() => {
    if (colorMode === "light") {
      globalState$.colorMode.set("dark");
      document.body.classList.add("dark");
      return;
    }

    globalState$.colorMode.set("light");
    document.body.classList.remove("dark");
  }, [colorMode]);

  return (
    <Flex width="100%" height="100%" className="py-2">
      <Flex align="center" width="100%" justify="between" className="py-3">
        <Flex direction="column" align="start">
          <Text className="text-[11.5px]" color="iris">
            Dark Mode
          </Text>
          <Text className="text-gray-400 text-[11px]">
            join the dark side,or stay in the light,we don't judge
          </Text>
        </Flex>
        <Switch
          defaultChecked={colorMode === "dark"}
          onCheckedChange={handleThemeChange}
          variant="surface"
        />
      </Flex>
    </Flex>
  );
}
