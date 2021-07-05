import { asyncPool } from '../concurrent/async-pool';

const arr = [1, 2, 3, 4];

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
