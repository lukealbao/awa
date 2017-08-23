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
  let buffer = [];

  let done = false;
  let bufferedValues = 0;  
  let buffering = tstart('Flush buffer');
  
  while (!done) {
    if (buffer.length > 1) { // Case 1
      if (bufferedValues < 1) {        
        buffering = tstart('Flush buffer');
      }
      const head = buffer.shift();
      //debug(`yields buffered value: ${inspect(head)}`);
      yield head;
      bufferedValues += 1;
      continue;
    }
    tlog(buffering);
    debug(`Yielded ${bufferedValues} buffered values`);
    bufferedValues = 0;

    let step = iterator.next();
    let current = null;
    
    while (isPromise(step.value)) {
      const p1 = tstart('Promise1');
      step.value = yield step.value;

      if (isAwaIterable(sequence)) {
        step = iterator.next(step.value);
      }
      tlog(p1);
    }

    if (buffer.length === 0) {
      if (step.done) return;
      while (isPromise(step.value)) {
        const p2 = tstart('Promise2');
        step.value = yield step.value;

        if (isAwaIterable(sequence)) {
          step = iterator.next(step.value);
        }
        tlog(p2);
      }
      current = step.value;
      step = iterator.next();
      while (isPromise(step.value)) {
        const p3 = tstart('Promise3');
        step.value = yield step.value;

        if (isAwaIterable(sequence)) {
          step = iterator.next(step.value);
        }
        tlog(p3);
      }
      debug(`Initial iteration:`)// (${inspect(current)}), (${inspect(step)})`);
    } else {
      current = buffer.shift();
      debug(`partial(?)`)// current is ${inspect(current)}`);
    }

    if (step.done) {
      done = true;
      yield current;
      continue; // Any partial values come out, then is done for next iteration.
    }

    const jt = tstart('Joining');
    const joined = join(current, step.value);
    buffer = fn(joined);

    tlog(jt);
    //debug(`joined`)// ${inspect(joined)}`);
    //debug(`predicate`)//, buffer is ${inspect(buffer)}`);
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
