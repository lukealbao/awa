'use strict';

const debug = require('util').debuglog('awa/map');
const {
  isPromise,
  isAwaIterable
} = require('../lib/predicates');

function map (fn, seq) {
  if (seq === undefined) {
    return function (seq) {
      return mapping(fn, seq);
    };
  } else {
    return mapping(fn, seq);
  }
}

function mapping (fn, seq) {
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

      yield fn(step.value);
    }
  }

  return {
    IS_AWAITERABLE: true,
    [Symbol.for('is_awaiterable')]: true,
    [Symbol.iterator]: iterator
  };
}

module.exports = map;
