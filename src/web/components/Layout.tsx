import { Flex } from "@radix-ui/themes";
import { Sidebar } from "lucide-react";
import type React from "react";
import Icon from "./icon";

type LayoutProps = {
  children?: React.ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  return (
    <Flex
      direction="column"
      className="transition w-full h-screen bg-neutral-100 relative dark:bg-black font-light"
    >
      <Flex align="center" justify="between" className="bg-white">
        <Flex align="center" justify="start">
          <button className="px-3 py-3 text-indigo-600">
            <Sidebar size={13}/>
          </button>
          <button className="px-2 py-3 text-neutral-600">
            <Icon name="Expand" size={13}/>
          </button>
        </Flex>
        <Flex grow="1" id="drag-region" p="2"/>
        <Flex align="center" justify="end" gap="2">
          <button className="px-2 py-3 text-neutral-600">
            <Icon name="Minus" size={13}/>
          </button>
          <button className="px-2 py-3 text-neutral-600">
            <Icon name="Maximize" size={13}/>
          </button>
          <button className="px-2 py-3 text-red-500">
            <Icon name="X" size={13}/>
          </button>
        </Flex>
      </Flex>
    </Flex>
  );
}
