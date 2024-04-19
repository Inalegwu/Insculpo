import { useEffect } from "react";

export default function useWindow<K extends keyof WindowEventMap>(
  type: K,
  listener: (this: Window, ev: WindowEventMap[K]) => unknown,
): void {
  useEffect(() => {
    window.addEventListener(type, listener);

    () => {
      window.removeEventListener(type, listener);
    };
  }, [type, listener]);
}
