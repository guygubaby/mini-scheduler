/*!
  * mini-scheduler v1.0.0
  * (c) 2021 bryce
  * @license MIT
  */
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const getAsyncFunc = (type) => {
    let func;
    switch (type) {
        case 'setTimeout':
            func = window.setTimeout;
            break;
        case 'requestAnimationFrame':
            func = window.requestAnimationFrame;
            break;
        default:
            throw new Error("currently only support 'setTimeout' | 'requestAnimationFrame' types");
    }
    return func;
};
const getTime = () => performance.now();
const clearTimers = (timerQueue, clearTimerFunc) => {
    let _timer = timerQueue.pop();
    while (timerQueue.length && _timer) {
        clearTimerFunc(_timer);
        _timer = timerQueue.pop();
    }
};
const p = Promise.resolve();
const nextTick = (fn) => p.then(fn);
const isGenerator = (target) => {
    if (!target)
        return false;
    return target.toString().includes('Generator');
};

const queue = [];
let queued = false;
let fps = 60;
let renderTime = 10;
let triggerFunc = window.setTimeout;
const timerQueue = [];
const shouldYield = (startTime) => {
    return (navigator?.scheduling?.isInputPending() ||
        getTime() < startTime + 1000 / fps - renderTime);
};
const stepFunc = (generator) => {
    const step = () => {
        const start = getTime();
        let temp = null;
        do {
            temp = generator.next();
        } while (!temp.done && shouldYield(start));
        if (temp.done) {
            const clearTimerFunc = triggerFunc === window.setTimeout
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
            const timerId = triggerFunc(stepFunc(res));
            timerQueue.push(timerId);
        }
        else {
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
        let res = null;
        do {
            res = generator.next();
        } while (!res.done && shouldYield(start));
        if (res.done) {
            const clearTimerFunc = triggerFunc === window.setTimeout
                ? window.clearTimeout
                : window.cancelAnimationFrame;
            clearTimers(timerQueue, clearTimerFunc);
            return;
        }
        const timerId = triggerFunc(next);
        timerQueue.push(timerId);
    };
};
const queueJob = (job) => {
    if (!queue.includes(job))
        queue.push(job);
    if (!queued) {
        queued = true;
        nextTick(queueFlushJobs());
    }
};
const judgeConfig = (config) => {
    const { fps: _fps = 60, renderTime: _renderTime = 10, funcType: _funcType = 'setTimeout', } = config;
    if (fps <= 0 || fps > 120) {
        throw new Error(`fps must between 0~120, instead of ${fps}`);
    }
    if (renderTime <= 0 || renderTime >= 1000 / 60) {
        throw new Error(`fps must between 0~${Math.floor(1000 / 60)}, instead of ${renderTime} ms`);
    }
    if (!['setTimeout', 'requestAnimationFrame'].includes(_funcType)) {
        throw new TypeError('funcType must be window.setTimeout or window.requestAnimationFrame');
    }
    fps = _fps;
    renderTime = _renderTime;
    triggerFunc =
        _funcType === 'setTimeout'
            ? window.setTimeout
            : window.requestAnimationFrame;
};
const ts = (arr, func, config = {
    fps: 60,
    renderTime: 10,
    funcType: 'setTimeout',
}) => {
    judgeConfig(config);
    for (let i = 0; i < arr.length; i++) {
        queueJob(() => func(arr[i], i, arr));
    }
};
const tsGenerator = (func, config = {
    fps: 60,
    renderTime: 10,
    funcType: 'setTimeout',
}) => {
    if (!isGenerator(func)) {
        throw new TypeError('payload func must be a generator ');
    }
    judgeConfig(config);
    const timerId = triggerFunc(stepFunc(func));
    timerQueue.push(timerId);
};

const asyncPool = async (limit, arr, func) => {
    const ret = [];
    const executing = [];
    for (const item of arr) {
        const p = Promise.resolve().then(() => func(item, arr));
        ret.push(p);
        if (limit <= arr.length) {
            const e = p.then(() => executing.splice(executing.indexOf(e), 1));
            executing.push(e);
            if (executing.length >= limit) {
                await Promise.race(executing);
            }
        }
    }
    return await Promise.all(ret);
};

exports.asyncPool = asyncPool;
exports.clearTimers = clearTimers;
exports.getAsyncFunc = getAsyncFunc;
exports.getTime = getTime;
exports.isGenerator = isGenerator;
exports.nextTick = nextTick;
exports.ts = ts;
exports.tsGenerator = tsGenerator;
