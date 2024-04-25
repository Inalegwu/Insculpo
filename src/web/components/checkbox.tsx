import { Checkbox, Flex, Text } from "@radix-ui/themes";
import type React from "react";
import { useRef } from "react";

type Props = React.ClassAttributes<HTMLLIElement> &
  React.LiHTMLAttributes<HTMLLIElement>;

export default function CheckBox(props: Props) {
  const checkboxRef = useRef<HTMLButtonElement>(null);

  return (
    <Flex align="center" gap="2">
      <Checkbox ref={checkboxRef} defaultChecked={false} />
      <Text>{props.children}</Text>
    </Flex>
  );
}
