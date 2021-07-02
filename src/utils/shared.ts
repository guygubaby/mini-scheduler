import { threshold, renderTime } from '@/constants';
import type { AsyncFuncType, ClearTimerFuncType, FuncType } from '@/types';

export const noop = () => {};

export const getAsyncFunc = (type?: AsyncFuncType): FuncType => {
  let func: FuncType;
  switch (type) {
    case 'setTimeout':
      func = window.setTimeout;
      break;
    case 'requestAnimationFrame':
      func = window.requestAnimationFrame;
      break;
    default:
      throw new Error(
        "currently only support 'setTimeout' | 'promise' | 'requestAnimationFrame' types"
      );
  }
  return func;
};

export const getTime = () => performance.now();

export const shouldYield = (startTime: number): boolean => {
  return (
    (navigator as any)?.scheduling?.isInputPending() ||
    getTime() < startTime + threshold - renderTime
  );
};

export const clearTimers = (
  timerQueue: number[],
  clearTimerFunc: ClearTimerFuncType
): void => {
  console.log(timerQueue.length);
  let _timer = timerQueue.pop();
  while (timerQueue.length && _timer) {
    clearTimerFunc(_timer);
    _timer = timerQueue.pop();
  }
};
