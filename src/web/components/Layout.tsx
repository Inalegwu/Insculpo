import { useObservable } from "@legendapp/state/react";
import { GearFine, Info, Minus, Plus, Sidebar, X } from "@phosphor-icons/react";
import { Box, Button, Flex, IconButton, Text, Tooltip } from "@radix-ui/themes";
import t from "@src/shared/config";
import { Document, FlatList } from "@src/web/components";
import { useDebounce, useTimeout, useWindow } from "@src/web/hooks";
import { globalState$, noteState } from "@src/web/state";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { motion } from "framer-motion";
import type React from "react";
import { useCallback, useEffect, useRef } from "react";

type LayoutProps = {
  children?: React.ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  const { mutate: minimize } = t.window.minimize.useMutation();
  const { mutate: close } = t.window.closeWindow.useMutation();
  const routeState = useRouterState();
  const nav = useNavigate();

  const inputRef = useRef<HTMLInputElement>(null);

  const { data: notes } = t.notes.getNotes.useQuery();
  const { data: ver } = t.version.useQuery();

  const passedThres = useObservable(false);
  const finder = useObservable(false);
  const sideBarFocus = useObservable(false);
  const searchInputFocus = useObservable(false);

  useEffect(() => {
    if (globalState$.colorMode.get() === "dark") {
      document.body.classList.add("dark");
    }
  }, []);

  useTimeout(() => {
    if (finder.get() && !searchInputFocus.get()) {
      finder.set(false);
    }
  }, 3000);

  useTimeout(() => {
    if (passedThres.get() && !sideBarFocus.get()) {
      passedThres.set(false);
    }
  }, 3000);

  useWindow("keypress", (e) => {
    if (e.keyCode === 6 && !finder.get()) {
      finder.set(true);
      inputRef.current?.focus();
    }
  });

  const mouseMove = useDebounce((e: MouseEvent) => {
    const threshold = e.clientX / window.innerWidth;

    if (threshold >= 0.97 && !passedThres.get()) {
      passedThres.set(true);
    }
  }, 90);

  useWindow("mousemove", mouseMove);

  const handleNewClicked = useCallback(() => {
    noteState.activeNoteId.set(null);
    if (routeState.location.pathname !== "/") {
      nav({
        to: "/",
      });
    }
  }, [nav, routeState]);

  return (
    <Flex
      width="100%"
      align="center"
      className="transition w-full h-screen bg-gray-100 relative p-2 dark:bg-gray-800 font-light"
    >
      {/* actual body */}
      <Flex width="100%" height="100%">
        {/* page content */}
        <motion.div
          animate={{ width: passedThres.get() ? "70%" : "100%" }}
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
          transition={{ duration: 0.4 }}
          layout
        >
          <Box className="w-full h-full rounded-md bg-white dark:bg-slate-700 font-light">
            {children}
          </Box>
        </motion.div>
        {/* sidebar */}
        <motion.div
          initial={{ width: "0%", opacity: 0 }}
          animate={{
            opacity: passedThres.get() ? 1 : 0,
            width: passedThres.get() ? "30%" : "0%",
          }}
          transition={{ width: { duration: 0.5 }, opacity: { duration: 0.7 } }}
          onMouseOver={() => sideBarFocus.set(true)}
          onMouseLeave={() => sideBarFocus.set(false)}
          layout
        >
          <Flex
            width="100%"
            direction="column"
            align="start"
            justify="between"
            height="100%"
          >
            {/* main sidebar */}
            <Flex
              direction="column"
              align="end"
              justify="start"
              width="100%"
              className="h-[94%]"
            >
              {/* window actions */}
              <Flex
                align="center"
                className="gap-5 mb-2 py-2 px-2"
                justify="end"
                width="100%"
              >
                <Flex grow="1" id="drag-region" className="p-2" />
                <Button
                  variant="ghost"
                  color="gray"
                  className="w-3 h-5 rounded-full flex items-center justify-center text-black/20 dark:text-gray-400"
                  onClick={() => passedThres.set(false)}
                >
                  <Sidebar size={13} />
                </Button>
                <Button
                  variant="ghost"
                  color="gray"
                  className="w-3 h-5 rounded-full flex items-center justify-center text-black/20 dark:text-gray-400"
                  onClick={() => minimize()}
                >
                  <Minus size={13} />
                </Button>
                <Button
                  variant="ghost"
                  color="gray"
                  className="w-3 h-5 rounded-full flex items-center justify-center text-black/20 dark:text-gray-400"
                  type="button"
                  onClick={() => close()}
                >
                  <X size={13} />
                </Button>
              </Flex>
              <FlatList
                data={notes || []}
                className="px-2"
                renderItem={({ item, index }) => (
                  <Document doc={item.doc} key={index} />
                )}
              />
            </Flex>
            {/* bottom bar */}
            <Flex
              width="100%"
              className="py-2 px-3"
              align="end"
              justify="between"
            >
              <Flex align="center" gap="4" grow="1">
                <Tooltip content="About">
                  <IconButton
                    onClick={() => nav({ to: "/about" })}
                    variant="ghost"
                    radius="full"
                    size="2"
                  >
                    <Info size={13} />
                  </IconButton>
                </Tooltip>
                <Tooltip content="Preferences">
                  <IconButton asChild variant="ghost" radius="full" size="2">
                    <Link to="/settings">
                      <GearFine size={13} />
                    </Link>
                  </IconButton>
                </Tooltip>
                <Tooltip content="New Note">
                  <IconButton
                    variant="ghost"
                    radius="full"
                    size="2"
                    onClick={handleNewClicked}
                  >
                    <Plus size={13} />
                  </IconButton>
                </Tooltip>
              </Flex>
              <Flex align="end" justify="end">
                <Text className="text-[8px] text-gray-400 text-right">
                  Build Version {ver}
                </Text>
              </Flex>
            </Flex>
          </Flex>
        </motion.div>
      </Flex>
    </Flex>
  );
}

// not useful for now...
//  <DropdownMenu.Root>
//   <DropdownMenu.Trigger>
//     <IconButton variant="ghost" size="2" radius="full">
//       <Sliders />
//     </IconButton>
//   </DropdownMenu.Trigger>
//   <DropdownMenu.Content
//     defaultValue="dateCreated"
//     size="1"
//     className="dark:bg-slate-700"
//   >
//     <DropdownMenu.Label>Sort By</DropdownMenu.Label>
//     <DropdownMenu.CheckboxItem textValue="dateCreated">
//       <Text>Date Created</Text>
//     </DropdownMenu.CheckboxItem>
//     <DropdownMenu.CheckboxItem textValue="dateUpdated">
//       <Text>Recently Updated</Text>
//     </DropdownMenu.CheckboxItem>
//   </DropdownMenu.Content>
// </DropdownMenu.Root>;
