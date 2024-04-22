import { throttle } from "@src/shared/utils";
import { useEffect, useMemo } from "react";

export function useThrottle<A = unknown[], R = void>(
  fn: (args: A) => R,
  interval = 500,
) {
  const [throttleFn, tearDown] = useMemo(
    () => throttle<A, R>(fn, interval),
    [fn, interval],
  );

  useEffect(() => () => tearDown(), [tearDown]);

  return throttleFn;
}
