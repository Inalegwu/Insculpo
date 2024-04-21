import { useRef } from "react";

export default function useEditor() {
  const editorRef = useRef<HTMLTextAreaElement>(null);

  return [editorRef];
}
