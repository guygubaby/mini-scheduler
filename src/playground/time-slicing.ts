import { ts, tsGenerator } from '@/time-slicing';

const button = document.querySelector('#button') as HTMLButtonElement;

document.addEventListener('mousemove', ({ pageX, pageY }) => {
  if (!button) return;
  button.style.top = `${pageY}px`;
  button.style.left = `${pageX}px`;
});

const longTask = () => {
  const start = performance.now();
  while (performance.now() < start + 30) {}
  console.log('long task done');
};

function* longTaskGenerator() {
  const start = performance.now();
  while (performance.now() < start + 300) {
    yield;
  }
  console.log('long task done');
}

const arr = Array.from({ length: 5 }, (_, index) => index);

window.setTimeout(() => {
  tsGenerator(longTaskGenerator(), 60);
  // ts(arr, longTaskGenerator, 30);
  // ts(arr, longTask, 30);
}, 2000);
