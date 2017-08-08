'use strict';

async function forEach (fn, sequence) {
  const iterator = sequence[Symbol.iterator]();
  let iterations = 0;

  for (let item of iterator) {
    if (item && typeof item.then === 'function') {
      item = await item;
      // Calling next() directly means we need to take the value.
      item = iterator.next({value: item, done: false}).value;
    }

    fn(item);
    iterations += 1;
  }

  return iterations;
}

module.exports = forEach;
