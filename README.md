# Mini Scheduler

A mini scheduler for task handler in browser

## Install

```bash
yarn add mini-scheduler
```

## Features

1. time slicing (schedule long task not prevent render)
2. concurrent (async pool support)

## Usage

### time slicing mode (for better render performance)

1. fast jobs

    ```ts
    import { ts, TimeSlicingConfig } from 'mini-scheduler';

    const arr = Array.from({ length: 20 }, (_, i) => i);

    const timeSlicingConfig: TimeSlicingConfig = {
      fps: 60,
      renderTime: 10,
      funcType: 'setTimeout',
    };

    const fastTask = () => {
      const start = performance.now();
      while (performance.now() < start + 5) {}
      console.log('long task done');
    };

    ts(arr, fastTask, timeSlicingConfig);
    ```

2. slow jobs

    ```ts
    import { ts, TimeSlicingConfig } from 'mini-scheduler';

    const arr = Array.from({ length: 20 }, (_, i) => i);

    const timeSlicingConfig: TimeSlicingConfig = {
      fps: 60,
      renderTime: 10,
      funcType: 'setTimeout',
    };

    function* longTaskGenerator() {
      const start = performance.now();
      while (performance.now() < start + 50) {
        yield;
      }
      console.log('long task done');
    }

    ts(arr, longTaskGenerator, timeSlicingConfig);
    ```

3. slow job

    ```ts
    import { tsGenerator, TimeSlicingConfig } from 'mini-scheduler';

    const timeSlicingConfig: TimeSlicingConfig = {
      fps: 60,
      renderTime: 10,
      funcType: 'setTimeout',
    };

    function* veryLongTaskGenerator() {
      const start = performance.now();
      while (performance.now() < start + 500) {
        yield;
      }
      console.log('very long task done');
    }

    tsGenerator(veryLongTaskGenerator(), timeSlicingConfig);
    ```

### concurrent mode (for better task runner performance)

```ts
import { asyncPool } from 'mini-scheduler';

const arr = Array.from({ length: 20 }, (_, i) => i);

const task = <T>(item: T) => {
  return new Promise((resolve) => {
    window.setTimeout(async () => {
      console.log(item, 'done');
      resolve(item);
    }, 2000);
  });
};

asyncPool(2, arr, async (item, _) => {
  await task(item);
});

```

## References

- [fre](https://github.com/yisar/fre/blob/master/src/schedule.ts)
- [solidjs](https://github.com/solidjs/solid/blob/main/packages/solid/src/reactive/scheduler.ts)
- [mini-vue](https://github.com/cuixiaorui/mini-vue/blob/master/src/runtime-core/scheduler.ts)
- [petite-vue](https://github.com/vuejs/petite-vue/blob/main/src/scheduler.ts)
- [async-pool](https://github.com/rxaviers/async-pool)