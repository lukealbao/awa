'use strict';

const {
  isAwaIterable,
  isPromise
} = require('../lib/predicates');

const SENTINEL = Symbol.for('awa.sentinel');

function take (n, seq) {
  const source = seq[Symbol.iterator]();

  function* iterator () {
    let done = false;

    while (!done) {
      let step = source.next();

      if ((n -= 1) < 0) {
        done = true;
        step = source.next(SENTINEL);
        return;
      }

      while (isPromise(step.value)) {
        step.value = yield step.value;

        if (isAwaIterable(seq)) {
          step = source.next(step.value);
        }
      }

      if (step.done) {
        done = true;
        break;
      }

      yield step.value;
    }
  }

  return {
    [Symbol.iterator]: iterator,
    IS_AWAITERABLE: true
  };
}

module.exports = take;
