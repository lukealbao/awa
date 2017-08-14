'use strict';

const {debuglog, inspect} = require('util');
const debug = debuglog('awa/forEach');

async function forEach (fn, sequence) {
  const iterator = sequence[Symbol.iterator]();
  let iterations = 0;
  let done = false;

  while (!done) {
    let next = iterator.next();

    if (next.value && typeof next.value.then === 'function') {
      next.value = await next.value;
      debug(`await resolved ${inspect(next.value)}`);

      next = iterator.next(next.value); // {done: boolean, value: <T>|void}
    }

    if (next.done) {
      done = true;
      break;
    }

    fn(next.value);
    iterations += 1;
    debug(`processed ${iterations} items`);
  }

  return iterations;
}

module.exports = forEach;
