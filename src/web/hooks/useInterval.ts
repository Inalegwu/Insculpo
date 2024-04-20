import { useEffect } from "react";

export default function useInterval(fn: () => unknown, ms: number) {
  useEffect(() => {
    const t = setInterval(fn, ms);

    return () => {
      clearInterval(t);
    };
  }, [fn, ms]);
}
