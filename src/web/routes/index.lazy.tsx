import { useObservable } from "@legendapp/state/react";
import { Flex, TextArea } from "@radix-ui/themes";
import t from "@src/shared/config";
import { createLazyFileRoute } from "@tanstack/react-router";
import React, { useCallback } from "react";

export const Route = createLazyFileRoute("/")({
  component: Index,
});

function Index() {
  const utils = t.useUtils();
  const text = useObservable("");

  const { mutate: saveNote } = t.notes.saveNote.useMutation();

  const handleEditorInput = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      text.set(e.currentTarget.value);
      saveNote({ content: e.currentTarget.value });
    },
    [text, saveNote],
  );

  return (
    <Flex className="w-full h-full">
      <TextArea
        value={text.get()}
        onChange={handleEditorInput}
        className="w-full h-full outline-indigo-100"
      />
      <Flex className="absolute z-10 bottom-2 rounded-full right-2 px-3 py-3" />
    </Flex>
  );
}
