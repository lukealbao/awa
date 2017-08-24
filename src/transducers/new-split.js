'use strict';

const assert = require('assert');
const {debuglog, inspect} = require('util');
const debug = debuglog('awa/split');
const {
  isPromise,
  isAwaIterable
} = require('../lib/predicates');

function tstart (id) {
  return {
    id: id,
    start: process.hrtime()
  };
}

function tlog (t) {
  const end = process.hrtime(t.start);
  debug(`Latency(${t.id}): ${end[0] + end[1]/1e9}s`);
}

// So, fn is T -> Collection<T>. We have a predicate that looks at the length
// of Collection<T> and decides whether to do:
// 1. Yield some slice of the collection.
// 2. Consume a step from its source, and join it to the current
//    value in Collection<T>.
function* split (fn, sequence) {
  const iterator = sequence[Symbol.iterator]();
  let buffer = null;
  let last = '';

  while (true) {
    let step = iterator.next();

    while (isPromise(step.value)) {
      step.value = yield step.value;

      if (isAwaIterable(sequence)) {
        step = iterator.next(step.value);
      }
    }

    if (step.done) {
      return;
    }

    last = join(last, step.value);
    buffer = fn(last);
    last = buffer.pop();
    for (var i = 0; i < buffer.length; i++) {
      yield buffer[i];
    }
  }
}

function join (a, b) {
  assert(typeof a === typeof b,
         `Cannot join mismatched types: ${inspect(a)} | ${inspect(b)}`);
  //debug(`joining(${inspect(a)}, ${inspect(b)})`);

  if (typeof a === 'string') {
    return a + b;
  } else if (Array.isArray(a)) {
    return a.concat(b);
  }
}

module.exports = split;
