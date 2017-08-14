'use strict';

// into :: (output: (Null | Iterable), input: (Iterable | LazyIterable))
//         -> Promise<Iterable>
//
// Accepts A reference to an iterable collection (Map, Set, Array), which will
// default to an empty Array. Will consume all of the input iterable and resolve
// the output collection.
//
// ---- Notable features ----
//
// -- Output: Map --
// When the output collection is a Map, the items consumed from the input will
// be inspected. If they appear to be tuples (i.e., 2-length Array), then each
// item will be treated as a key-val pair. An input of [[1, 'a'], [2, 'b']] will
// result in Map{ 1 => 'a', 2 => 'b'}. Otherwise, each value will be treated as
// a key pointing to an undefied value.

const {debuglog, inspect} = require('util');
const debug = debuglog('awa/into');

async function into (output, seq) {
  const iterator = seq[Symbol.iterator]();

  let done = false;

  while (!done) {
    let next = iterator.next(); // {done: boolean, value: T | Promise<T>}

    if (next.done) {
      done = true;
      break;
    }

    while (next.value && typeof next.value.then === 'function') {
      // item :: Promise<T>
      next.value = await next.value; // T
      debug(`await resolved ${inspect(next.value)}`);

      next = iterator.next(next.value); // {done: boolean, value: T}

      if (next.done) {
        done = true;
        return output;
      }
    }

    addTo(output, next.value);
    debug(`pushed value ${inspect(next.value)}`);
  }

  return output;
}

// Helper: addTo (Collection, Any) -> Collection
function addTo (coll, value) {
  switch (true) {
  case (coll instanceof Array):
    coll.push(value);
    break;
  case (coll instanceof Set):
    coll.add(value);
    break;
  case (coll instanceof Map):
    // Getting maybe too magic here, but let's assume if the client
    // gives us a tuple, it's a key-val pair.
    if (value
        && typeof value[Symbol.iterator] === 'function'
        && value.length === 2) {
      const [key, val] = value;
      coll.set(key, val);
    } else {
      coll.set(value);
    }
    break;
  default:
    throw new TypeError(`Cannot consume into value: ${coll}`);
  }

  return coll;
}

module.exports = into;
