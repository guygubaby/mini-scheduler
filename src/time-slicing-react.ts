import scheduler from 'scheduler';

export const createTimeSlicing = (
  func: () => Generator<number, number, unknown>
) => {
  const gen = func();
  let res: null | IteratorResult<number, number> = null;

  function next() {
    do {
      res = gen.next();
    } while (!res.done && scheduler.unstable_shouldYield());
    if (res.done) {
      console.log('all done');
      return;
    }

    const tempFunc = scheduler.unstable_wrapCallback(next);
    scheduler.unstable_scheduleCallback(
      scheduler.unstable_NormalPriority,
      tempFunc
    );
  }

  next();
};
