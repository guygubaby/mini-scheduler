import { getTime, isGenerator, nextTick } from '@/utils/shared';

const queue: Array<Function> = [];
let queued = false;

let fps: number = 60;
let renderTime: number = 10;

const shouldYield = (startTime: number): boolean => {
  return (
    (navigator as any)?.scheduling?.isInputPending() ||
    getTime() < startTime + 1000 / fps - renderTime
  );
};

const stepFunc = (
  generator: Generator,
  triggerFunc: typeof window.setTimeout = window.setTimeout
) => {
  const step = () => {
    const start = getTime();
    let temp: null | IteratorResult<any, any> = null;
    do {
      temp = generator.next();
    } while (!temp.done && shouldYield(start));
    if (temp.done) return;

    triggerFunc(step);
  };

  return step;
};

function* flushJobs() {
  for (let i = 0; i < queue.length; i++) {
    const func = queue[i];
    const res = func();

    if (isGenerator(res)) {
      const triggerFunc = window.setTimeout;
      triggerFunc(stepFunc(res as Generator, triggerFunc));
    } else {
      yield res;
    }
  }
  queue.length = 0;
  queued = false;
}

const queueFlushJobs = () => {
  const generator = flushJobs();
  const triggerFunc = window.setTimeout;

  return function next() {
    const start = getTime();
    let res: null | IteratorResult<any, any> = null;
    do {
      res = generator.next();
    } while (!res.done && shouldYield(start));

    if (res.done) {
      return;
    }
    triggerFunc(next);
  };
};

const queueJob = (job: Function) => {
  if (!queue.includes(job)) queue.push(job);
  if (!queued) {
    queued = true;
    nextTick(queueFlushJobs());
  }
};

const judgeFpsAndRenderTime = (fps: number, renderTime: number) => {
  if (fps <= 0 || fps > 120) {
    throw new Error(`fps must between 0~120, instead of ${fps}`);
  }
  if (renderTime <= 0 || renderTime >= 1000 / 60) {
    throw new Error(
      `fps must between 0~${Math.floor(1000 / 60)}, instead of ${renderTime} ms`
    );
  }
  fps = fps;
  renderTime = renderTime;
};

export const ts = <T, U>(
  arr: T[],
  func: (item: T, index: number, arr: T[]) => U,
  fps: number = 60,
  renderTime: number = 10
) => {
  judgeFpsAndRenderTime(fps, renderTime);

  for (let i = 0; i < arr.length; i++) {
    queueJob(() => func(arr[i], i, arr));
  }
};

export const tsGenerator = <T, U>(
  func: Generator<T, any, U>,
  fps: number = 60,
  renderTime: number = 10
) => {
  if (!isGenerator(func)) {
    throw new TypeError('payload func must be a generator ');
  }

  judgeFpsAndRenderTime(fps, renderTime);

  const triggerFunc = window.setTimeout;
  triggerFunc(stepFunc(func, triggerFunc));
};
