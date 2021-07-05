import type { AsyncFuncType, ClearTimerFuncType, FuncType } from '@/types';

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
        "currently only support 'setTimeout' | 'requestAnimationFrame' types"
      );
  }
  return func;
};

export const getTime = () => performance.now();

export const clearTimers = (
  timerQueue: number[],
  clearTimerFunc: ClearTimerFuncType
): void => {
  let _timer = timerQueue.pop();
  while (timerQueue.length && _timer) {
    clearTimerFunc(_timer);
    _timer = timerQueue.pop();
  }
};

const p = Promise.resolve();

export const nextTick = (fn: () => void) => p.then(fn);

export const isGenerator = (target: any): boolean => {
  return target.toString().includes('Generator');
};
