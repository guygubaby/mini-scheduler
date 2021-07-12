# Mini Scheduler

A mini scheduler for task handler in browser

## Why scheduler

### 1. Concurrent
Concurrency behavior make your code run faster

### 2. Time Slicing
1. before
![before-time-slicing](https://camo.githubusercontent.com/504c9313eea563f764baa07e55ea5ba484123e85e2f6635608415fc18eefb8ad/68747470733a2f2f73332e616d617a6f6e6177732e636f6d2f6d656469612d702e736c69642e65732f75706c6f6164732f3734333730322f696d616765732f353631363434342f6c6f6e672d7461736b2e706e67)

2. after
![after-time-slicing](https://camo.githubusercontent.com/edeea09605d5fd065fe6ef5e706cff2b168fd36a0c848a991736df9158306422/68747470733a2f2f73332e616d617a6f6e6177732e636f6d2f6d656469612d702e736c69642e65732f75706c6f6164732f3734333730322f696d616765732f353631363930332f7061737465642d66726f6d2d636c6970626f6172642e706e67)

## Install

```bash
yarn add mini-scheduler
```

## Features

1. time slicing (schedule long task not prevent render)
2. concurrent (async pool support)

## Usage

### Time Slicing Mode (for better render performance)

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

### Concurrent Mode (for better task runner performance)

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
