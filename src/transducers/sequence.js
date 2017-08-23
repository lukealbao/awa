'use strict';

const debug = require('util').debuglog('awa/sequence');
const {
  isPromise,
  isAwaIterable
} = require('../lib/predicates');

function sequence (seq) {
  function* iterator () {
    let done = false;
    const source = seq[Symbol.iterator]();
    let i = 0;

    while (!done) {
      let step = source.next();
      debug(`step[${i}]`, step.value);

      // It's possible that we resolve a Promise value for a source,
      // but some source-level filter does not yield that value back. Rather,
      // the next value is again a Promise. In this case, we need to resolve
      // it again. So we enter the while loop until it is resolved.
      while (isPromise(step.value)) {
        step.value = yield step.value; // T -> T

        if (isAwaIterable(seq)) {
          step = source.next(step.value);
        }
      }

      if (step.done) {
        debug('step is done, returning');
        done = true;
        return;
      }

      debug(`yielding value[${i}]`, step.value);
      yield step.value;
      i++;
    }
  }

  return {
    IS_AWAITERABLE: true,
    [Symbol.for('is_awaiterable')]: true,
    [Symbol.iterator]: iterator
  };
}

module.exports = sequence;
