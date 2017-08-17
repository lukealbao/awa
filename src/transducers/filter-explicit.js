'use strict';

const debug = require('util').debuglog('awa/filter');
const {
  isPromise,
  isAwaIterable
} = require('../lib/predicates');

function filter (fn, seq) {
  if (seq === undefined) {
    return function (seq) {
      return filtering(fn, seq);
    };
  } else {
    return filtering(fn, seq);
  }
}

function filtering (fn, seq) {
  function* iterator () {
    let done = false;
    const source = seq[Symbol.iterator]();

    while (!done) {
      let step = source.next();

      while (isPromise(step.value)) {
        step.value = yield step.value;

        if (isAwaIterable(seq)) {
          step = source.next(step.value);
        }
      }

      if (step.done) {
        done = true;
        return;
      }

      if (fn(step.value)) {
        yield step.value;
      }
    }
  }

  return {
    IS_AWAITERABLE: true,
    [Symbol.for('is_awaiterable')]: true,
    [Symbol.iterator]: iterator
  };
}

module.exports = filter;
