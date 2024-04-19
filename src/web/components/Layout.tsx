import { Show, useObservable } from "@legendapp/state/react";
import { Box, Flex } from "@radix-ui/themes";
import React from "react";
import { useWindow } from "../hooks";

type LayoutProps = {
  children?: React.ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  const finder = useObservable(false);

  useWindow("keypress", (e) => {
    if (e.keyCode === 6) {
      finder.set(true);
    }

    finder.set(false);
  });

  return (
    <Flex
      width="100%"
      className="transition w- h-screen bg-slate-100 relative p-2 font-[nunito]"
    >
      <Show if={finder}>
        <Flex
          className="absolute z-10 w-full h-screen"
          align="center"
          direction="column"
          justify="center"
        >
          <input
            className="border-[0.1px] border-opacity-[0.3] border-gray w-4/6 px-4 py-4 shadow-lg p-2 bg-white rounded-md outline-none"
            placeholder="Search..."
          />
        </Flex>
      </Show>
      <Box className="w-full rounded-md bg-white">{children}</Box>
    </Flex>
  );
}
