import { asyncPool } from "../concurrent/async-pool";

const arr = [1, 2, 3, 4];

asyncPool(2, arr, async (item: number) => {
  console.log(item + " executed");
});
