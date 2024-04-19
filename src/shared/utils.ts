export function debounce<A = unknown[], R = void>(
  fn: (args: A) => R,
  ms: number,
): [(args: A) => Promise<R>, () => void] {
  let t: NodeJS.Timeout;

  const debouncedFn = (args: A): Promise<R> =>
    new Promise((resolve) => {
      if (t) {
        clearTimeout(t);
      }

      t = setTimeout(() => {
        resolve(fn(args));
      }, ms);
    });

  const tearDown = () => clearTimeout(t);

  return [debouncedFn, tearDown];
}
