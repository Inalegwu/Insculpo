import { useObservable } from "@legendapp/state/react";
import {
  CornersOut,
  GearFine,
  Minus,
  Plus,
  Sidebar,
  Sliders,
  Trash,
  X,
} from "@phosphor-icons/react";
import {
  Box,
  Button,
  ContextMenu,
  DropdownMenu,
  Flex,
  Text,
} from "@radix-ui/themes";
import t from "@src/shared/config";
import { motion } from "framer-motion";
import React, { useCallback, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { useWindow } from "../hooks";
import { globalState$, noteState } from "../state";

type LayoutProps = {
  children?: React.ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  const utils = t.useUtils();
  const { mutate: minimize } = t.window.minimize.useMutation();
  const { mutate: maximize } = t.window.maximize.useMutation();
  const { mutate: close } = t.window.closeWindow.useMutation();

  const inputRef = useRef<HTMLInputElement>(null);

  const { data: notes } = t.notes.getNotes.useQuery();
  const { mutate: deleteNote } = t.notes.deleteNote.useMutation({
    onSuccess: () => {
      utils.notes.invalidate();
      noteState.activeNoteId.set(null);
    },
    onError: (e) => {
      toast.error(e.message);
    },
  });
  const { mutate: search, data: results } = t.notes.findNote.useMutation({
    onError: (e) => {
      toast.error(e.message);
    },
  });

  const passedThres = useObservable(false);
  const finder = useObservable(false);
  const sideBarFocus = useObservable(false);
  const searchInputFocus = useObservable(false);

  const findNote = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.currentTarget.value.length < 3) return;

      search({ query: e.currentTarget.value });
    },
    [search],
  );

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (passedThres.get() && !sideBarFocus.get()) {
        console.log("here...");
        passedThres.set(false);
      }
    }, 2000);

    const finderTimeout = setTimeout(() => {
      if (finder.get() && !searchInputFocus.get()) {
        finder.set(false);
      }
    }, 3000);

    return () => {
      clearTimeout(timeout);
      clearTimeout(finderTimeout);
    };
  }, [passedThres, sideBarFocus, finder, searchInputFocus]);

  useWindow("keypress", (e) => {
    if (e.ctrlKey && e.key === "/") {
      console.log("hot-key pressed");
      passedThres.set(false);
    }
    if (e.keyCode === 6 && !finder.get()) {
      finder.set(true);
      inputRef.current?.focus();
    }
  });

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      const threshold = e.clientX / window.innerWidth;

      if (threshold >= 0.97 && !passedThres.get()) {
        passedThres.set(true);
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
          className="h-full w-[30%] overflow-y-hidden"
          direction="column"
          align="start"
          justify="between"
        >
          <Flex
            direction="column"
            align="end"
            justify="start"
            width="100%"
            className="h-[94%]"
            onMouseEnter={() => sideBarFocus.set(true)}
            onMouseLeave={() => sideBarFocus.set(false)}
          >
            {/* window actions */}
            <Flex
              align="center"
              className="gap-5 mb-2 mt-1 px-2"
              justify="end"
              width="100%"
            >
              <Flex grow="1" id="drag-region" className="p-2" />
              <Button
                variant="ghost"
                color="gray"
                className="w-3 h-5 rounded-full flex items-center justify-center"
                onClick={() => passedThres.set(false)}
              >
                <Sidebar size={13} className="text-black/30" />
              </Button>
              <Button
                variant="ghost"
                color="gray"
                className="w-3 h-5 rounded-full flex items-center justify-center"
                onClick={() => minimize()}
              >
                <Minus size={13} className="text-black/20" />
              </Button>
              <Button
                variant="ghost"
                className="w-3 h-5 rounded-full flex items-center justify-center"
                color="gray"
                onClick={() => maximize()}
              >
                <CornersOut size={13} className="text-black/20" />
              </Button>
              <Button
                variant="ghost"
                color="gray"
                className="w-3 h-5 rounded-full flex items-center justify-center"
                type="button"
                onClick={() => close()}
              >
                <X size={13} />
              </Button>
            </Flex>
            <Flex
              direction="column"
              className="h-full w-full overflow-y-scroll overflow-x-hidden"
            >
              {notes?.map((v) => {
                return (
                  <ContextMenu.Root>
                    <ContextMenu.Trigger>
                      <Flex
                        key={v.doc?._id}
                        width="100%"
                        className="px-1 py-2 rounded-md"
                        direction="column"
                        align="end"
                        justify="center"
                        onClick={() => noteState.activeNoteId.set(v.doc?._id)}
                      >
                        <Text size="1" className="text-black">
                          {v.doc?.name?.slice(0, 20)}
                        </Text>
                        <Text className="text-[12px] text-gray-400">{`${v.doc?.body?.slice(
                          0,
                          37,
                        )}`}</Text>
                      </Flex>
                    </ContextMenu.Trigger>
                    <ContextMenu.Content size="1" variant="soft">
                      <ContextMenu.Item
                        color="red"
                        onClick={() =>
                          deleteNote({ noteId: v.doc?._id!, rev: v.doc?._rev! })
                        }
                      >
                        <Trash />
                        <Text size="1">Delete Note</Text>
                      </ContextMenu.Item>
                    </ContextMenu.Content>
                  </ContextMenu.Root>
                );
              })}
            </Flex>
          </Flex>
          {/* bottom bar */}
          <Flex
            width="100%"
            className="py-2 px-3"
            align="center"
            justify="start"
            gap="5"
          >
            <Button
              onClick={() => globalState$.settingsVisible.set(true)}
              variant="ghost"
              className="rounded-full w-3 h-5"
            >
              <GearFine size={13} className="text-black" />
            </Button>
            <Button
              variant="ghost"
              className="rounded-full w-3 h-5"
              onClick={() => noteState.activeNoteId.set(null)}
            >
              <Plus size={13} className="text-black" />
            </Button>
            <DropdownMenu.Root>
              <DropdownMenu.Trigger>
                <Sliders />
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
      {/* search bar */}
      <motion.div
        animate={{
          opacity: finder.get() ? 1 : 0,
          scale: finder.get() ? 1 : 0,
        }}
        style={{ width: "100%", height: "100%" }}
        className="absolute z-20"
        onClick={() => finder.set(false)}
      >
        <Flex
          direction="column"
          gap="2"
          width="100%"
          height="100%"
          align="center"
          justify="center"
        >
          <input
            type="text"
            className="px-4 text-lg py-4 w-4/6 outline-none rounded-md shadow-lg border-none"
            placeholder="Find Note..."
            ref={inputRef}
            onChange={findNote}
            onFocus={() => searchInputFocus.set(true)}
            onBlur={() => searchInputFocus.set(false)}
          />
          {results?.length === 0 && <Text>No Results</Text>}
          {results && (
            <Flex direction="column" className="w-4/6 bg-white rounded-md">
              {results.map((v) => (
                <Text key={v._id}>{v.name}</Text>
              ))}
            </Flex>
          )}
        </Flex>
      </motion.div>
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
        <Box className="w-full h-full rounded-xxl bg-white">{children}</Box>
      </motion.div>
    </Flex>
  );
}
