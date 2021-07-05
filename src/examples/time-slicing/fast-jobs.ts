// if there're jobs is fast, use normal time slicing

import { TimeSlicingConfig, ts } from '@/time-slicing';

const fly = document.querySelector('#fly') as HTMLButtonElement;

document.addEventListener('mousemove', ({ pageX, pageY }) => {
  if (!fly) return;
  fly.style.top = `${pageY - 20}px`;
  fly.style.left = `${pageX - 20}px`;
});

const arr = Array.from({ length: 20 }, (_, i) => i);

const timeSlicingConfig: TimeSlicingConfig = {
  fps: 60,
  renderTime: 10,
  funcType: 'setTimeout',
};

const fastTask = () => {
  const start = performance.now();
  while (performance.now() < start + 5) {}
  console.log('long task done');
};

ts(arr, fastTask, timeSlicingConfig);
