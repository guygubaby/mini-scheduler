import { asyncPool } from '../../index';

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
