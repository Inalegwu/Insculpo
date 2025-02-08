import { Flex, Text } from "@radix-ui/themes";
import { Sidebar } from "lucide-react";
import { motion } from "motion/react";
import type React from "react";
import { useState } from "react";
import { useDebounce, useTimeout, useWindow } from "../hooks";
import Icon from "./icon";

type LayoutProps = {
  children?: React.ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  const [sidebar, setSidebar] = useState(true);
  const [titlebar, setTitlebar] = useState(true);
  const [passThres, setPassThresh] = useState(false);

  useWindow("keypress", (event) => {
    console.log(event.keyCode, event.ctrlKey, event.key);
  });

  const mouseMove = useDebounce((e: MouseEvent) => {
    const topThreshold = e.clientY / window.innerHeight;

    if (topThreshold >= 0.073 && !titlebar) {
      setTitlebar(true);
      setPassThresh(true);
    }
  }, 10);

  useTimeout(() => {
    if (passThres && !titlebar) {
      setTitlebar(false);
      setPassThresh(false);
    }
  }, 3000);

  useWindow("mousemove", mouseMove);

  return (
    <Flex className="transition w-full h-screen bg-neutral-50 dark:bg-black">
      <motion.div
        animate={{
          width: sidebar ? "21%" : "0%",
          opacity: sidebar ? 1 : 0,
          display: sidebar ? "flex" : "none",
        }}
        className="border-r-1 border-r-solid border-r-neutral-200 bg-neutral-100"
      >
        <Flex
          direction="column"
          align="start"
          width="100%"
          height="100%"
          className="px-2 py-0.3"
        >
          <Flex align="center" justify="between" width="100%">
            <Text size="5" weight="bold">
              Insculpo
            </Text>
            <Flex align="center" justify="end">
              <button
                onClick={() => setSidebar((sidebar) => !titlebar && !sidebar)}
                className="px-3 py-3 text-indigo-600"
              >
                <Sidebar size={13} />
              </button>
              <button
                onClick={() => setTitlebar((titlebar) => !titlebar)}
                className="px-2 py-3 text-neutral-600"
              >
                <Icon name="Expand" size={13} />
              </button>
            </Flex>
          </Flex>
        </Flex>
      </motion.div>
      {/* main body */}
      <motion.div
        animate={{
          width: sidebar ? "79%" : "100%",
        }}
        className="w-full"
      >
        {/* title bar-hideable */}
        <motion.div
          animate={{
            height: titlebar ? "5.6%" : "0%",
            display: titlebar ? "block" : "none",
            opacity: titlebar ? 1 : 0,
          }}
        >
          <Flex
            align="center"
            justify="between"
            className="border-b-1 border-b-solid border-b-neutral-200 dark:border-b-dark-700"
          >
            <motion.div
              animate={{
                opacity: sidebar ? 0 : 1,
                display: sidebar ? "none" : "block",
              }}
            >
              <Flex align="center" justify="start">
                <button
                  onClick={() => setSidebar((sidebar) => !sidebar)}
                  className="px-3 py-3 text-indigo-600"
                >
                  <Sidebar size={13} />
                </button>
                <button
                  onClick={() => setTitlebar((titlebar) => !titlebar)}
                  className="px-2 py-3 text-neutral-600"
                >
                  <Icon name="Expand" size={13} />
                </button>
              </Flex>
            </motion.div>
            <Flex grow="1" id="drag-region" p="2" />
            <Flex align="center" justify="end" gap="2">
              <button className="px-2 py-3 text-neutral-600">
                <Icon name="Minus" size={13} />
              </button>
              <button className="px-2 py-3 text-neutral-600">
                <Icon name="Maximize" size={13} />
              </button>
              <button className="px-2 py-3 text-red-500">
                <Icon name="X" size={13} />
              </button>
            </Flex>
          </Flex>
        </motion.div>
        <motion.div
          animate={{
            height: titlebar ? "95.4%" : "100%",
          }}
          className="bg-red-100"
        >
          <Flex>{children}</Flex>
        </motion.div>
      </motion.div>
    </Flex>
  );
}
