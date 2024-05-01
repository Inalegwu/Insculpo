import { Switch, useObservable } from "@legendapp/state/react";
import {
  Box,
  Button,
  ContextMenu,
  Flex,
  IconButton,
  Popover,
  Text,
  TextField,
  Tooltip,
} from "@radix-ui/themes";
import t from "@src/shared/config";
import { Document, FlatList } from "@src/web/components";
import { useDebounce, useEditor, useTimeout, useWindow } from "@src/web/hooks";
import { globalState$ } from "@src/web/state";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import type React from "react";
import { useCallback, useEffect } from "react";
import toast from "react-hot-toast";
import {
  FiArrowLeft,
  FiArrowRight,
  FiDownload,
  FiInfo,
  FiMinus,
  FiPlus,
  FiSettings,
  FiSidebar,
  FiTrash,
  FiX,
} from "react-icons/fi";

type LayoutProps = {
  children?: React.ReactNode;
};

type Route = {
  key: "Notes" | "Notebooks";
};

export default function Layout({ children }: LayoutProps) {
  const { mutate: minimize } = t.window.minimize.useMutation();
  const { mutate: close } = t.window.closeWindow.useMutation();
  const routeState = useRouterState();
  const nav = useNavigate();
  const utils = t.useUtils();

  const [text, activeNoteId] = useEditor();

  const { data: ver } = t.version.useQuery();

  const passedThres = useObservable(false);
  const sideBarFocus = useObservable(false);

  const route = useObservable<Route>({ key: "Notes" });

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
    if (passedThres.get() && !sideBarFocus.get()) {
      passedThres.set(false);
    }
  }, 3000);

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

  return (
    <Flex
      width="100%"
      align="center"
      className="transition w-full h-screen bg-gray-100 relative p-2 dark:bg-black font-light"
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
                <Flex
                  align="center"
                  justify="end"
                  gap="4"
                  className="items-center mb-4 px-3"
                >
                  <Button
                    variant="ghost"
                    size="1"
                    color="gray"
                    className="w-2 h-4 rounded-full cursor-pointer"
                    onClick={() => route.set({ key: "Notes" })}
                  >
                    <FiArrowLeft />
                  </Button>
                  <Button
                    variant="ghost"
                    size="1"
                    color="gray"
                    className="w-2 h-4 rounded-full cursor-pointer"
                    onClick={() => route.set({ key: "Notebooks" })}
                  >
                    <FiArrowRight />
                  </Button>
                </Flex>
                <Switch value={route.get().key}>
                  {{
                    Notes: () => <NoteListView />,
                    Notebooks: () => <NotebookListView />,
                  }}
                </Switch>
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

function NoteListView() {
  const { data: notes } = t.notes.getNotes.useQuery();
  return (
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
          <Text className="text-[10px] text-gray-400 font-light" color="gray">
            All Notes
          </Text>
        </Flex>
      )}
      renderItem={({ item, index }) => <Document doc={item} key={index} />}
    />
  );
}

function NotebookListView() {
  const utils = t.useUtils();
  const { data: notebooks } = t.notebooks.getNotebooks.useQuery();

  const notebookName = useObservable("");

  const { mutate: createNotebook } = t.notebooks.createNotebook.useMutation({
    onSuccess: () => {
      utils.notebooks.getNotebooks.invalidate();
    },
  });

  const { mutate: deleteNotebook } = t.notebooks.deleteNotebook.useMutation({
    onSuccess: () => {
      utils.notebooks.getNotebooks.invalidate();
    },
  });

  const saveNotebook = useCallback(() => {
    createNotebook({
      name: notebookName.get(),
    });
  }, [createNotebook, notebookName]);

  return (
    <FlatList
      data={notebooks || []}
      className="px-2"
      listHeaderComponent={() => (
        <Flex
          align="center"
          direction="row"
          justify="between"
          className="py-1 px-0"
        >
          <Popover.Root>
            <Popover.Trigger>
              <Button
                variant="ghost"
                className="w-2 h-4 rounded-full ml-1"
                color="gray"
              >
                <FiPlus />
              </Button>
            </Popover.Trigger>
            <Popover.Content className="px-3 py-4">
              <Flex direction="column" gap="2">
                <Text size="1" className="text-gray-400">
                  Notebook name
                </Text>
                <TextField.Root>
                  <TextField.Input
                    onChange={(e) => notebookName.set(e.currentTarget.value)}
                  />
                </TextField.Root>
                <Popover.Close>
                  <Button size="2" variant="soft" onClick={saveNotebook}>
                    <Text size="1">Create</Text>
                  </Button>
                </Popover.Close>
              </Flex>
            </Popover.Content>
          </Popover.Root>
          <Text className="text-[10px] text-gray-400 font-light" color="gray">
            All Notebooks
          </Text>
        </Flex>
      )}
      renderItem={({ item }) => (
        <ContextMenu.Root>
          <ContextMenu.Trigger className="cursor-pointer">
            <Flex
              direction="column"
              align="end"
              justify="center"
              className="py-2"
            >
              <Text weight="bold" className="text-[11.5px]" color="iris">
                {item.name}
              </Text>
              <Text className="text-[10px] text-gray-400">
                {item.notes.length} Notes
              </Text>
            </Flex>
          </ContextMenu.Trigger>
          <ContextMenu.Content size="1" variant="soft">
            <ContextMenu.Item
              color="red"
              onClick={() => deleteNotebook({ bookId: item.id })}
            >
              <Flex gap="1" align="center">
                <FiTrash />
                <Text size="1">Delete Notebook</Text>
              </Flex>
            </ContextMenu.Item>
          </ContextMenu.Content>
        </ContextMenu.Root>
      )}
    />
  );
}
