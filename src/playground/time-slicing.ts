import { createTimeSlicing } from '@/time-slicing';

const button = document.querySelector('#button') as HTMLButtonElement;

document.addEventListener('mousemove', ({ pageX, pageY }) => {
  if (!button) return;
  button.style.top = `${pageY}px`;
  button.style.left = `${pageX}px`;
});

function* longTask() {
  const start = performance.now();
  let count: number = 1;
  while (performance.now() < start + 3000) {
    yield ++count;
  }
  console.log('long task done');
  return 1;
}

const timeSlicedLongTask = createTimeSlicing(longTask, 'setTimeout');
timeSlicedLongTask();

// function longTask() {
//   const start = performance.now();
//   let count: number = 1;
//   while (performance.now() < start + 3000) {}
//   console.log('long task done');
//   return 1;
// }

// longTask();
