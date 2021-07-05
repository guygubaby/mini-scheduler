// export enum PriorityLevelEnum {
//   ImmediatePriority,
//   UserBlockingPriority,
//   IdlePriority,
//   LowPriority,
//   NormalPriority,
// }

// export interface TaskInterface {
//   id: number;
//   callback: Function;
//   priorityLevel?: PriorityLevelEnum;
//   startTime?: number;
//   expirationTime?: number;
//   sortIndex?: number;
// }

export type FuncType =
  | typeof window.setTimeout
  | typeof window.requestAnimationFrame;

export type ClearTimerFuncType =
  | typeof window.clearTimeout
  | typeof window.cancelAnimationFrame;

export type AsyncFuncType = 'setTimeout' | 'requestAnimationFrame';
