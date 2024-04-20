import { useEffect } from "react";

export default function useTimeout(fn: () => unknown, ms: number) {
  useEffect(() => {
    const t = setTimeout(fn, ms);

    return () => {
      clearTimeout(t);
    };
  }, [fn, ms]);
}