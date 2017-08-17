'use strict';

const assert = require('assert');
const {debuglog, inspect} = require('util');
const debug = debuglog('awa/split');

// So, fn is T -> Collection<T>. We have a predicate that looks at the length
// of Collection<T> and decides whether to do:
// 1. Yield some slice of the collection.
// 2. Consume a step from its source, and join it to the current
//    value in Collection<T>.
function* split (fn, sequence) {
  const iterator = sequence[Symbol.iterator]();
  let buffer = [];

  let done = false;

  while (!done) {
    if (buffer.length > 1) { // Case 1
      const head = buffer.shift();
      debug(`yields buffered value: ${inspect(head)}`);
      yield head;
      continue;
    }

    let step = iterator.next();
    let current = null;

    if (buffer.length === 0) {
      if (step.done) return;
      current = step.value;
      step = iterator.next();
      debug(`Initial iteration: (${inspect(current)}), (${inspect(step)})`);
    } else {
      current = buffer.shift();
      debug(`partial(?) current is ${inspect(current)}`);
    }

    if (step.done) {
      done = true;
      yield current;
      continue; // Any partial values come out, then is done for next iteration.
    }

    const joined = join(current, step.value);
    buffer = fn(joined);

    debug(`joined ${inspect(joined)}`);
    debug(`predicate, buffer is ${inspect(buffer)}`);
  }
}

function join (a, b) {
  assert(typeof a === typeof b,
         `Cannot join mismatched types: ${inspect(a)} | ${inspect(b)}`);
  debug(`joining(${inspect(a)}, ${inspect(b)})`);

  if (typeof a === 'string') {
    return a + b;
  } else if (Array.isArray(a)) {
    return a.concat(b);
  }
}

module.exports = split;
