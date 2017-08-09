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

async function into (output, seq) {
  const iterator = seq[Symbol.iterator]();

  for (let item of iterator) {
    while (item && typeof item.then === 'function') {
      item = await item;
      // Calling next() directly means we need to take the value.
      item = iterator.next({value: item, done: false});

      // TODO: Document - we were including undefined values (i.e., the results
      // of a done source), for example, an underlying filterer whose last
      // value failed the filter test. We'd be waiting for it in the previous
      // line since we resolved it for them, but they never yielded it back;
      // rather, they returned a done/undefined iteration.
      if (item.done) return output;
      item = item && item.value;

      // Example: A source yielded a promise, which we resolved, and passed
      // back. Then, a filtering transducer on the source skipped that value.
      // Thus its next value is not the transduced value we just resolved, but
      // rather a new promise that we need to resolve.
      //
      // We need a pattern that will resolve as long as we need to.
    }

    addTo(output, item);
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
