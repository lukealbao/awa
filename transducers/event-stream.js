'use strict';

const SlidingBuffer = require('../sources/SlidingBuffer');

function* eventStream (emitter, itemEvent, endEvent) {
  let listening = true;
  const buffer = new SlidingBuffer(); // length=1

  function future () {
    return new Promise(resolve => {
      const maybeValue = buffer.shift();
      if (maybeValue !== undefined) {
        resolve(maybeValue);
      } else {
        buffer.once('push', () => {
          resolve(buffer.shift());
        });
      }
    });
  }

  function enqueue (value) {
    return buffer.push(value);
  }

  emitter.on(itemEvent, enqueue);

  if (typeof endEvent === 'string') {
    emitter.once(endEvent, () => {
      emitter.removeListener(itemEvent, enqueue);
      listening = false;
    });
  }

  while (listening) {
    const nextVal = yield future();

    // TODO#1: Why did we need this conditional? With an event stream emitting
    // numbers, transformed into a LazySequence whose transducer maps events
    // to Math.pow(2, event), we got interleaved [1,NaN,2,NaN,4,...].
    //
    // Why? Probably /something/ was passing down a call to next() on this
    // stream without giving it an argument. But where?
    //
    // See PROBLEM in lazy-sequence. The client to this iterator is a lazy
    // sequence. We yield it a promise, but they never yield it back, because
    // there it is only yielded back if the source (i.e., this) is a
    // LazySequence.
    //
    // FIXME: It <might> be the case that this conditional, and the instanceof
    // conditional in the LazySequence could be removed. Question is, will we
    // skip values in cases where the source is NOT some yielding iterator?
    //
    // No, I don't think so, since that only happens if the produced value is
    // a Promise, in which case you already got (usually!) some yielding
    // sequence.
    if (nextVal && nextVal.value) {
      yield nextVal.value;
    }
  }
}

module.exports = eventStream;
