import { useObservable } from "@legendapp/state/react";
import {
  GearFine,
  Info,
  Minus,
  Plus,
  Sidebar,
  Sliders,
  X,
} from "@phosphor-icons/react";
import {
  Box,
  Button,
  DropdownMenu,
  Flex,
  IconButton,
  Text,
  Tooltip,
} from "@radix-ui/themes";
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
  const utils = t.useUtils();
  const { mutate: minimize } = t.window.minimize.useMutation();
  const { mutate: close } = t.window.closeWindow.useMutation();
  const routeState = useRouterState();
  const nav = useNavigate();

  const inputRef = useRef<HTMLInputElement>(null);

  const { data: notes } = t.notes.getNotes.useQuery();

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
      className="transition w-full h-screen  bg-gray-100 relative p-2 dark:bg-gray-800"
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
          transition={{ duration: 0.2 }}
          layout="size"
        >
          <Box className="w-full h-full rounded-lg bg-white dark:bg-slate-700">
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
          transition={{ duration: 0.2 }}
          onMouseOver={() => sideBarFocus.set(true)}
          onMouseLeave={() => sideBarFocus.set(false)}
          layout="size"
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
                className="gap-5 mb-2 mt-2 px-2"
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
                renderItem={({ item, index }) => (
                  <Document doc={item.doc} key={index} />
                )}
              />
            </Flex>
            {/* bottom bar */}
            <Flex
              width="100%"
              className="py-2 px-3"
              align="center"
              justify="start"
              gap="4"
            >
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
              <DropdownMenu.Root>
                <DropdownMenu.Trigger>
                  <IconButton variant="ghost" size="2" radius="full">
                    <Sliders />
                  </IconButton>
                </DropdownMenu.Trigger>
                <DropdownMenu.Content defaultValue="dateCreated" size="1">
                  <DropdownMenu.Label>Sort By</DropdownMenu.Label>
                  <DropdownMenu.CheckboxItem textValue="dateCreated">
                    <Text>Date Created</Text>
                  </DropdownMenu.CheckboxItem>
                  <DropdownMenu.CheckboxItem textValue="dateUpdated">
                    <Text>Recently Updated</Text>
                  </DropdownMenu.CheckboxItem>
                </DropdownMenu.Content>
              </DropdownMenu.Root>
            </Flex>
          </Flex>
        </motion.div>
      </Flex>
    </Flex>
  );
}
