const renderTime = 10;
let fps = 60;
let queued = false;
const queue: Array<Function> = [];
const p = Promise.resolve();

const nextTick = (fn: () => void) => p.then(fn);

const isGenerator = (target: any): boolean => {
  return target.toString().includes('Generator');
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

const getTime = () => performance.now();

const shouldYield = (startTime: number): boolean => {
  return (
    (navigator as any)?.scheduling?.isInputPending() ||
    getTime() < startTime + 1000 / fps - renderTime
  );
};

const queueFlushJobs = () => {
  const generator = flushJobs();
  const triggerFunc = window.setTimeout;

  return function next() {
    const start = getTime();
    let res: null | IteratorResult<any, any> = null;
    do {
      res = generator.next();
      // can emit temp res
    } while (!res.done && shouldYield(start));

    if (res.done) {
      console.log('all done');
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

export const ts = <T, U>(
  arr: T[],
  func: (item: T, index: number, arr: T[]) => U,
  fps: number = 60
) => {
  for (let i = 0; i < arr.length; i++) {
    queueJob(() => func(arr[i], i, arr));
  }
  fps = fps;
};

export const tsGenerator = <T, U>(
  func: Generator<T, any, U>,
  fps: number = 60
) => {
  if (!isGenerator(func)) {
    throw new TypeError('payload func must be a generator ');
  }
  fps = fps;
  const triggerFunc = window.setTimeout;
  triggerFunc(stepFunc(func, triggerFunc));
};
