import { useObservable } from "@legendapp/state/react";
import { Box, Button, Flex, IconButton, Text, Tooltip } from "@radix-ui/themes";
import t from "@src/shared/config";
import { Document, FlatList } from "@src/web/components";
import { useDebounce, useEditor, useTimeout, useWindow } from "@src/web/hooks";
import { globalState$ } from "@src/web/state";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { formatTextForSidebar } from "@utils";
import { AnimatePresence, motion } from "framer-motion";
import type React from "react";
import { useCallback, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import {
  FiDownload,
  FiInfo,
  FiMinus,
  FiPlus,
  FiSettings,
  FiSidebar,
  FiX,
} from "react-icons/fi";

type LayoutProps = {
  children?: React.ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  const { mutate: minimize } = t.window.minimize.useMutation();
  const { mutate: close } = t.window.closeWindow.useMutation();
  const routeState = useRouterState();
  const nav = useNavigate();

  const [text, activeNoteId] = useEditor();

  const inputRef = useRef<HTMLInputElement>(null);

  const { data: notes } = t.notes.getNotes.useQuery();
  const { data: ver } = t.version.useQuery();

  const passedThres = useObservable(false);
  const finder = useObservable(false);
  const sideBarFocus = useObservable(false);
  const searchInputFocus = useObservable(false);

  const { mutate: findNote, data: results } = t.notes.findNote.useMutation();

  const { mutate: dumpAllNotes } = t.notes.dumpNotes.useMutation({
    onSuccess: () => {
      toast.success("All notes exported successfully");
    },
    onError: (e) => {
      console.log(e.message);
      toast.error("Couldn't export notes");
    },
  });

  useEffect(() => {
    if (globalState$.colorMode.get() === "dark") {
      document.body.classList.add("dark");
    }

    if (globalState$.firstLaunch.get()) {
      nav({
        to: "/firstlaunch",
      });
    }
  }, [nav]);

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
    activeNoteId.set(null);
    text.set("");
    globalState$.editorState.set("writing");
    if (routeState.location.pathname !== "/") {
      nav({
        to: "/",
      });
    }
  }, [nav, routeState, activeNoteId, text]);

  const handleSearchResultClicked = useCallback(
    (id: string) => {
      activeNoteId.set(id);
      if (routeState.location.pathname !== "/") {
        nav({
          to: "/",
        });
      }
    },
    [nav, routeState, activeNoteId],
  );

  return (
    <Flex
      width="100%"
      align="center"
      className="transition w-full h-screen bg-gray-100 relative p-2 dark:bg-black font-light"
    >
      <AnimatePresence initial={false}>
        <motion.div
          animate={{
            opacity: finder.get() ? 1 : 0,
            scale: finder.get() ? 1 : 0,
            display: finder.get() ? "flex" : "none",
          }}
          className="absolute z-20 flex items-center justify-center"
          style={{ width: "97%", height: "100%" }}
          onClick={() => finder.set(false)}
        >
          <Flex
            direction="column"
            gap="2"
            className="px-2 py-2 bg-white rounded-md w-4/6 shadow-lg rounded-md dark:bg-slate-700"
          >
            <input
              onFocus={() => {
                searchInputFocus.set(true);
                inputRef.current?.focus();
              }}
              onBlur={() => {
                searchInputFocus.set(false);
                inputRef.current?.blur();
              }}
              placeholder="Search Notes..."
              ref={inputRef}
              onChange={(e) => findNote({ query: e.currentTarget.value })}
              className="px-3 py-3 w-full text-[14px] border-none bg-slate-50 outline-none rounded-md font-light dark:bg-slate-800 dark:text-white dark:border-solid dark:border-1 dark:border-gray-200/20"
            />
            <FlatList
              data={results || []}
              listHeaderComponent={() => (
                <Flex align="center" justify="start">
                  <Text className="text-gray-400 text-[11px]">
                    Search Results
                  </Text>
                </Flex>
              )}
              renderItem={({ item }) => (
                <Flex
                  align="center"
                  onClick={() => handleSearchResultClicked(item._id)}
                  justify="between"
                  className="px-1 py-2 cursor-pointer"
                >
                  <Flex direction="column">
                    <Text color="iris" className="text-[11.5px]">
                      {item.name}
                    </Text>
                    <Text className="text-[11px] text-gray-400">
                      {formatTextForSidebar(item.body.slice(0, 40))}
                    </Text>
                  </Flex>
                </Flex>
              )}
            />
          </Flex>
        </motion.div>
      </AnimatePresence>
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
          <Box className="w-full h-full rounded-md bg-slate-50 dark:bg-dark-9 font-light border-1 border-solid border-gray-400/40 dark:border-gray-400/10">
            {children}
          </Box>
        </motion.div>
        <AnimatePresence mode="wait">
          {/* sidebar */}
          <motion.div
            initial={false}
            animate={{
              opacity: passedThres.get() ? 1 : 0,
              width: passedThres.get() ? "30%" : "0%",
            }}
            transition={{
              width: { duration: 0.6 },
              opacity: { duration: 0.1 },
            }}
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
                className="h-[94%] px-0"
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
                    {/* <Sidebar size={13} /> */}
                    <FiSidebar size={11} />
                  </Button>
                  <Button
                    variant="ghost"
                    color="gray"
                    className="w-3 h-5 rounded-full flex items-center justify-center text-black/20 dark:text-gray-400"
                    onClick={() => minimize()}
                  >
                    <FiMinus size={11} />
                  </Button>
                  <Button
                    variant="ghost"
                    color="gray"
                    className="w-3 h-5 rounded-full flex items-center justify-center text-black/20 dark:text-gray-400"
                    type="button"
                    onClick={() => close()}
                  >
                    <FiX size={11} />
                  </Button>
                </Flex>
                <FlatList
                  data={notes || []}
                  className="px-2"
                  listHeaderComponent={() => (
                    <Flex
                      align="center"
                      direction="row"
                      justify="end"
                      className="py-1 px-0"
                    >
                      <Text
                        className="text-[10px] text-gray-400 font-light"
                        color="gray"
                      >
                        All Notes
                      </Text>
                    </Flex>
                  )}
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
                      className="cursor-pointer"
                    >
                      <FiInfo size={11} />
                    </IconButton>
                  </Tooltip>
                  <Tooltip content="Preferences">
                    <IconButton
                      className="cursor-pointer"
                      variant="ghost"
                      radius="full"
                      size="2"
                      asChild
                    >
                      <Link to="/settings">
                        <FiSettings size={11} />
                      </Link>
                    </IconButton>
                  </Tooltip>
                  <Tooltip content="New Note">
                    <IconButton
                      variant="ghost"
                      radius="full"
                      size="2"
                      className="cursor-pointer"
                      onClick={handleNewClicked}
                    >
                      <FiPlus size={11} />
                    </IconButton>
                  </Tooltip>
                  <Tooltip content="Export all notes">
                    <IconButton
                      variant="ghost"
                      radius="full"
                      size="2"
                      className="cursor-pointer"
                      onClick={() => dumpAllNotes()}
                    >
                      <FiDownload size={11} />
                    </IconButton>
                  </Tooltip>
                </Flex>
                <Flex align="end" justify="end">
                  <Text className="text-[9px] text-gray-400 text-right">
                    Build Version {ver}
                  </Text>
                </Flex>
              </Flex>
            </Flex>
          </motion.div>
        </AnimatePresence>
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
