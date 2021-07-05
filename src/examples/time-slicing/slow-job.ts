// if there's job is slow, use another generator time slicing

import { TimeSlicingConfig, tsGenerator } from '../../index';

const fly = document.querySelector('#fly') as HTMLButtonElement;

document.addEventListener('mousemove', ({ pageX, pageY }) => {
  if (!fly) return;
  fly.style.top = `${pageY - 20}px`;
  fly.style.left = `${pageX - 20}px`;
});

const timeSlicingConfig: TimeSlicingConfig = {
  fps: 60,
  renderTime: 10,
  funcType: 'setTimeout',
};

function* veryLongTaskGenerator() {
  const start = performance.now();
  while (performance.now() < start + 500) {
    yield;
  }
  console.log('very long task done');
}

tsGenerator(veryLongTaskGenerator(), timeSlicingConfig);
