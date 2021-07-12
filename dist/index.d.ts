import { AsyncFuncType as AsyncFuncType$1, FuncType as FuncType$1, ClearTimerFuncType as ClearTimerFuncType$1 } from '@/types';

interface TimeSlicingConfig {
    fps?: number;
    renderTime?: number;
    funcType?: AsyncFuncType$1;
}
declare const ts: <T, U>(arr: T[], func: (item: T, index: number, arr: T[]) => U, config?: TimeSlicingConfig) => void;
declare const tsGenerator: <T, U>(func: Generator<T, any, U>, config?: TimeSlicingConfig) => void;

declare type FuncType = typeof window.setTimeout | typeof window.requestAnimationFrame;
declare type ClearTimerFuncType = typeof window.clearTimeout | typeof window.cancelAnimationFrame;
declare type AsyncFuncType = 'setTimeout' | 'requestAnimationFrame';

declare const getAsyncFunc: (type?: AsyncFuncType$1 | undefined) => FuncType$1;
declare const getTime: () => number;
declare const clearTimers: (timerQueue: number[], clearTimerFunc: ClearTimerFuncType$1) => void;
declare const nextTick: (fn: () => void) => Promise<void>;
declare const isGenerator: (target: any) => boolean;

declare const asyncPool: <T extends unknown, U extends unknown>(limit: number, arr: T[], func: (item: T, arr: T[]) => U) => Promise<U[]>;

export { AsyncFuncType, ClearTimerFuncType, FuncType, TimeSlicingConfig, asyncPool, clearTimers, getAsyncFunc, getTime, isGenerator, nextTick, ts, tsGenerator };
