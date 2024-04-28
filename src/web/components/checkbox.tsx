import { Checkbox, Flex, Text } from "@radix-ui/themes";
import type React from "react";
import { useRef } from "react";

type Props = React.ClassAttributes<HTMLLIElement> &
  React.LiHTMLAttributes<HTMLLIElement>;

export default function CheckBox(props: Props) {
  const checkboxRef = useRef<HTMLButtonElement>(null);

  return (
    <Text as="label">
      <Flex align="center" gap="2">
        <Checkbox ref={checkboxRef} defaultChecked={false} color="iris" />
        <Text size="1" weight="light" as="span">
          {props.children}
        </Text>
      </Flex>
    </Text>
  );
}
