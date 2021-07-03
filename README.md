# scheduler

## features

- time slicing (run in every event loop, within 1000/60 ms)
- task type choose
  - Task (like react)
  - MicroTask (like vue)

## references

- https://github.com/yisar/fre/blob/master/src/schedule.ts
- https://github.com/solidjs/solid/blob/main/packages/solid/src/reactive/scheduler.ts
- https://github.com/cuixiaorui/mini-vue/blob/master/src/runtime-core/scheduler.ts

## Tasks types

### 1. small task

use concurrent queue

### 2. long task

use time slicing scheduler (ensure browser perform in high fps)
