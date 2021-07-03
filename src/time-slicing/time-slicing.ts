import type { AsyncFuncType } from "../types";
import {
  clearTimers,
  getAsyncFunc,
  getTime,
  noop,
  shouldYield,
} from "../utils/shared";

export const createTimeSlicing = <T, U, K>(
  gen: () => Generator<T, U, K>,
  asyncFuncType: AsyncFuncType = "requestAnimationFrame"
) => {
  if (!gen) return noop;
  const generator = gen();
  if (typeof generator.next !== "function") return noop;

  const clearTimerFunc =
    asyncFuncType === "setTimeout"
      ? window.clearTimeout
      : window.cancelAnimationFrame;
  const triggerFunc = getAsyncFunc(asyncFuncType);
  const timerQueue: number[] = [];

  let ret: number | Promise<void> | null = null;

  return function next() {
    const start = getTime();

    let res: null | IteratorResult<T, U> = null;
    do {
      res = generator.next();
      // can emit temp res
    } while (!res.done && shouldYield(start));

    if (res.done) {
      // clear timer
      clearTimers(timerQueue, clearTimerFunc);
      console.log("all done");
      return;
    }

    ret = triggerFunc(next);

    // save timer to clear later
    if (typeof ret === "number") {
      timerQueue.push(ret);
    }
  };
};
