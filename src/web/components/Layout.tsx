import { Show, useObservable, useObserveEffect } from "@legendapp/state/react";
import { CornersOut, GearFine, Minus, Sidebar, X } from "@phosphor-icons/react";
import { Box, Button, Flex, TextFieldInput } from "@radix-ui/themes";
import t from "@src/shared/config";
import { motion } from "framer-motion";
import React, { useCallback } from "react";
import { useWindow } from "../hooks";
import { globalState$ } from "../state";

type LayoutProps = {
  children?: React.ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  const { mutate: minimize } = t.window.minimize.useMutation();
  const { mutate: maximize } = t.window.maximize.useMutation();
  const { mutate: close } = t.window.closeWindow.useMutation();

  const { data: notes } = t.notes.getNotes.useQuery();

  const passedThres = useObservable(false);
  const finder = useObservable(false);

  useObserveEffect(() => {
    const timeout = setTimeout(() => {
      if (finder.get()) {
        finder.set(false);
      }
    }, 2000);

    return () => {
      clearTimeout(timeout);
    };
  });

  useWindow("keypress", (e) => {
    if (e.keyCode === 6 && !finder.get()) {
      finder.set(true);
    }
  });

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      const threshold = e.clientX / window.innerWidth;

      if (threshold >= 0.97 && !passedThres.get()) {
        passedThres.set(true);
        console.log("passed threshol");
      }
    },
    [passedThres],
  );

  return (
    <Flex
      width="100%"
      align="center"
      className="transition w-full h-screen bg-slate-50 relative p-2"
      onMouseMove={handleMouseMove}
    >
      {/* sidebar */}
      <motion.div
        animate={{
          opacity: passedThres.get() ? 1 : 0,
          display: passedThres.get() ? "flex" : "none",
        }}
        style={{
          width: "99%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
        }}
        className="absolute z-0 bg-teal-0 p-2"
      >
        <Flex
          className="h-full w-[30%]"
          direction="column"
          align="start"
          justify="between"
        >
          <Flex
            grow="1"
            direction="column"
            align="end"
            width="100%"
            className="p-2"
          >
            {/* window actions */}
            <Flex align="center" className="gap-4" justify="end" width="100%">
              <Flex grow="1" id="drag-region" className="p-2" />
              <button
                className="w-3 h-5 rounded-full flex items-center justify-center"
                onClick={() => passedThres.set(false)}
                type="button"
              >
                <Sidebar size={13} className="text-black/30" />
              </button>
              <button
                className="w-3 h-5 rounded-full flex items-center justify-center"
                type="button"
                onClick={() => minimize()}
              >
                <Minus size={13} className="text-black/20" />
              </button>
              <button
                className="w-3 h-5 rounded-full flex items-center justify-center"
                type="button"
                onClick={() => maximize()}
              >
                <CornersOut size={13} className="text-black/20" />
              </button>
              <button
                className="w-3 h-5 rounded-full flex items-center justify-center"
                type="button"
                onClick={() => close()}
              >
                <X size={13} className="text-red-500/50" />
              </button>
            </Flex>
            {notes?.map((v) => {
              return v.name;
            })}
          </Flex>
          {/* bottom bar */}
          <Flex
            width="100%"
            className="py-2 px-3"
            align="center"
            justify="start"
          >
            <Button
              onClick={() => globalState$.settingsVisible.set(true)}
              variant="ghost"
              className="rounded-full w-3 h-5"
            >
              <GearFine size={13} className="text-black" />
            </Button>
          </Flex>
        </Flex>
      </motion.div>
      {/* search bar */}
      <Show if={finder}>
        <motion.div
          animate={{
            opacity: finder.get() ? 1 : 0,
            scale: finder.get() ? 1 : 0,
          }}
          style={{ width: "100%", height: "100%" }}
          className="absolute z-20"
          onClick={() => finder.set(false)}
        >
          <Flex width="100%" height="100%" align="center" justify="center">
            <TextFieldInput
              size="3"
              width="100%"
              className="px-2 py-4"
              placeholder="Find Note..."
            />
          </Flex>
        </motion.div>
      </Show>
      <div
        id="drag-region"
        className="p-4 w-full h-full absolute z-0 top-0 left-0"
      />
      <motion.div
        animate={{ width: passedThres.get() ? "70%" : "100%" }}
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <Box className="w-full h-full rounded-xl bg-white">{children}</Box>
      </motion.div>
    </Flex>
  );
}
