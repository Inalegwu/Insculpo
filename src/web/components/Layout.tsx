import { useObservable } from "@legendapp/state/react";
import {
  Download,
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
  IconButton,
  Text,
  Tooltip,
} from "@radix-ui/themes";
import t from "@src/shared/config";
import { formatTextForSidebar } from "@src/shared/utils";
import { useDebounce, useTimeout, useWindow } from "@src/web/hooks";
import { noteState } from "@src/web/state";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { motion } from "framer-motion";
import type React from "react";
import { useCallback, useRef } from "react";
import toast from "react-hot-toast";

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

  const { mutate: deleteNote } = t.notes.deleteNote.useMutation({
    onSuccess: (_, v) => {
      utils.notes.invalidate();
      noteState.activeNoteId.set(null);
      if (noteState.activeNoteId.get() === v.noteId) {
        noteState.activeNoteId.set(null);
      }
    },
    onError: (e) => {
      toast.error(e.message);
    },
  });

  const { mutate: dumpNote } = t.notes.dumpNote.useMutation({
    onSuccess: () => {
      toast.success("Note exported successfully");
    },
    onError: (e) => {
      toast.error("Couldn't export note");
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
  }, 60);

  useWindow("mousemove", mouseMove);

  const handleNoteClick = useCallback(
    (id: string) => {
      noteState.activeNoteId.set(id);
      if (routeState.location.pathname !== "/") {
        nav({
          to: "/",
        });
      }
    },
    [routeState, nav],
  );

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
      className="transition w-full h-screen  bg-gray-100 relative p-2"
      // onMouseMove={handleMouseMove}
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
        transition={{ duration: 0.2 }}
        className="absolute z-0 bg-teal-0 p-2"
        onMouseEnter={() => sideBarFocus.set(true)}
        onMouseLeave={() => sideBarFocus.set(false)}
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
              {notes?.map((v) => (
                <ContextMenu.Root key={v.doc?._id}>
                  <ContextMenu.Trigger className="cursor-pointer">
                    <Flex
                      width="100%"
                      className="px-2 py-2 rounded-md"
                      direction="column"
                      align="end"
                      justify="center"
                      onClick={() => handleNoteClick(v.doc?._id!)}
                    >
                      <Text color="iris" weight="bold" className="text-[11px]">
                        {v.doc?.name?.slice(0, 37)}
                      </Text>
                      <Text
                        className="text-[10.5px] text-gray-400 font-medium"
                        color="gray"
                      >
                        {formatTextForSidebar(v.doc?.body?.slice(0, 30) || "")}
                      </Text>
                    </Flex>
                  </ContextMenu.Trigger>
                  <ContextMenu.Content size="1" variant="soft">
                    <ContextMenu.Item
                      onClick={() => dumpNote({ noteId: v.doc?._id || "" })}
                    >
                      <Flex gap="1">
                        <Download />
                        <Text size="1">Export Note</Text>
                      </Flex>
                    </ContextMenu.Item>
                    <ContextMenu.Item
                      color="red"
                      onClick={() =>
                        deleteNote({ noteId: v.doc?._id!, rev: v.doc?._rev! })
                      }
                    >
                      <Flex gap="1">
                        <Trash />
                        <Text size="1">Delete Note</Text>
                      </Flex>
                    </ContextMenu.Item>
                  </ContextMenu.Content>
                </ContextMenu.Root>
              ))}
            </Flex>
          </Flex>
          {/* bottom bar */}
          <Flex
            width="100%"
            className="py-2 px-3"
            align="center"
            justify="start"
            gap="4"
          >
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
            className="px-4 text-lg py-4 w-3/6 outline-none rounded-md shadow-lg border-none"
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
      {/* actual body */}
      <motion.div
        animate={{ width: passedThres.get() ? "70%" : "100%" }}
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
        }}
        transition={{ duration: 0.3 }}
      >
        <Box className="w-full h-full rounded-lg bg-white">{children}</Box>
      </motion.div>
    </Flex>
  );
}
