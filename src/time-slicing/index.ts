import { AsyncFuncType, FuncType } from '@/types';
import { clearTimers, getTime, isGenerator, nextTick } from '@/utils/shared';

const queue: Array<Function> = [];
let queued = false;

let fps: number = 60;
let renderTime: number = 10;
let triggerFunc: FuncType = window.setTimeout;

const timerQueue: number[] = [];

const shouldYield = (startTime: number): boolean => {
  return (
    (navigator as any)?.scheduling?.isInputPending() ||
    getTime() < startTime + 1000 / fps - renderTime
  );
};

const stepFunc = (generator: Generator) => {
  const step = () => {
    const start = getTime();
    let temp: null | IteratorResult<any, any> = null;
    do {
      temp = generator.next();
    } while (!temp.done && shouldYield(start));

    if (temp.done) {
      const clearTimerFunc =
        triggerFunc === window.setTimeout
          ? window.clearTimeout
          : window.cancelAnimationFrame;
      clearTimers(timerQueue, clearTimerFunc);
      return;
    }

    const timerId = triggerFunc(step);
    timerQueue.push(timerId);
  };

  return step;
};

function* flushJobs() {
  for (let i = 0; i < queue.length; i++) {
    const func = queue[i];
    const res = func();

    if (isGenerator(res)) {
      const timerId = triggerFunc(stepFunc(res as Generator));
      timerQueue.push(timerId);
    } else {
      yield res;
    }
  }
  queue.length = 0;
  queued = false;
}

const queueFlushJobs = () => {
  const generator = flushJobs();

  return function next() {
    const start = getTime();
    let res: null | IteratorResult<any, any> = null;
    do {
      res = generator.next();
    } while (!res.done && shouldYield(start));

    if (res.done) {
      const clearTimerFunc =
        triggerFunc === window.setTimeout
          ? window.clearTimeout
          : window.cancelAnimationFrame;
      clearTimers(timerQueue, clearTimerFunc);
      return;
    }

    const timerId = triggerFunc(next);
    timerQueue.push(timerId);
  };
};

const queueJob = (job: Function) => {
  if (!queue.includes(job)) queue.push(job);
  if (!queued) {
    queued = true;
    nextTick(queueFlushJobs());
  }
};

const judgeConfig = (config: TimeSlicingConfig) => {
  const {
    fps: _fps = 60,
    renderTime: _renderTime = 10,
    funcType: _funcType = 'setTimeout',
  } = config;
  if (fps <= 0 || fps > 120) {
    throw new Error(`fps must between 0~120, instead of ${fps}`);
  }
  if (renderTime <= 0 || renderTime >= 1000 / 60) {
    throw new Error(
      `fps must between 0~${Math.floor(1000 / 60)}, instead of ${renderTime} ms`
    );
  }
  if (!['setTimeout', 'requestAnimationFrame'].includes(_funcType)) {
    throw new TypeError(
      'funcType must be window.setTimeout or window.requestAnimationFrame'
    );
  }
  fps = _fps;
  renderTime = _renderTime;
  triggerFunc =
    _funcType === 'setTimeout'
      ? window.setTimeout
      : window.requestAnimationFrame;
};

export interface TimeSlicingConfig {
  fps?: number;
  renderTime?: number;
  funcType?: AsyncFuncType;
}

export const ts = <T, U>(
  arr: T[],
  func: (item: T, index: number, arr: T[]) => U,
  config: TimeSlicingConfig = {
    fps: 60,
    renderTime: 10,
    funcType: 'setTimeout',
  }
) => {
  judgeConfig(config);

  for (let i = 0; i < arr.length; i++) {
    queueJob(() => func(arr[i], i, arr));
  }
};

export const tsGenerator = <T, U>(
  func: Generator<T, any, U>,
  config: TimeSlicingConfig = {
    fps: 60,
    renderTime: 10,
    funcType: 'setTimeout',
  }
) => {
  if (!isGenerator(func)) {
    throw new TypeError('payload func must be a generator ');
  }

  judgeConfig(config);

  const timerId = triggerFunc(stepFunc(func));
  timerQueue.push(timerId);
};
