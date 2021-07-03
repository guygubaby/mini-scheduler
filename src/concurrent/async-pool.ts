export const asyncPool = async <T extends any, U extends any>(
  limit: number,
  arr: T[],
  func: (item: T, arr: T[]) => U
) => {
  const ret: Promise<U>[] = [];
  const executing: Promise<U>[] = [];

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
