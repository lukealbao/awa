'use strict';

const SlidingBuffer = require('../sources/SlidingBuffer');
const {isPrimitive, debuglog, inspect} = require('util');
const debug = debuglog('awa/eventstream');
const {SENTINEL} = require('../index.js');
const deepcopy = require('deep-copy');
const clone = x => {
  if (isPrimitive(x)) return x;
  return deepcopy(x);
};

function bufferedEventStream (emitter, itemEvent, endEvent) {
  const buffer = new SlidingBuffer(10);
  var endListener;

  function enqueue (value) {
    const ret = buffer.push(clone(value));
    debug(`#${itemEvent}: buffering(${value})`);
    return ret;
  }

  function close (buffer, endListener) {
    debug(`#${endEvent}: closing stream`);
    emitter.removeListener(itemEvent, enqueue);
    if (typeof endListener === 'function') {
      endListener();
    }
  }

  emitter.on(itemEvent, enqueue);
  let listening = true;

  if (typeof endEvent === 'string') {
    emitter.once(endEvent, () => {
      if (buffer.isEmpty()) {
        close(buffer, endListener);
        listening = false;
      } else {
        debug(`#${endEvent}: waiting on full buffer`);
        buffer.once('empty', () => {
          close(buffer, endListener);
          listening = false;
        });
      }
    });
  }

  // Each future represents a client's call to next(). It is essentially
  // a state machine which operates on 3 different inputs:
  // - source#end: When the source emitter emits an <endEvent>, then the
  //   machine will resolve the awa.SENTINEL Symbol. When this symbol is
  //   yielded back, the whole generator will stop.
  // - buffer=ready: If an event has already been placed in the buffer,
  //   the machine simply resolves it immediately.
  // - buffer#push: If no event is available, the machine enters a waiting
  //   state. Once a new event value has been pushed into the buffer, the
  //   machine will resolve it.
  //
  // The trickiest part is the way source#end is handled. The interface of
  // an event stream requires that it respond with iterations ({done, value})
  // to calls to its iterator.next() method. However, the listener for an
  // end event is not subject to this control flow (or even lexical scope).
  // Because the futures and their respective resolvers are run in sequence,
  // we can safely register each resolver as a listener for the end event,
  // removing it once a data event occurs. At any given point, `endListener`
  // closes over the latest resolver, and so if and when the end event fires,
  // the sentinel is passed to the correct resolver.
  function future () {
    return new Promise(resolve => {
      endListener = function () {
        resolve(SENTINEL);
      };

      if (buffer.isEmpty()) {
        buffer.once('push', () => {
          const value = buffer.shift();
          endListener = undefined;
          resolve(value);
        });
      } else {
        const value = buffer.shift();
        endListener = (undefined);
        resolve(value);
      }
    });
  }

  // Generators only run on next tick, so we have to export a plain function
  // in order to get the listeners attached during this tick.
  function* iterator () {
    while (listening) {
      const nextVal = yield future();

      if (nextVal === SENTINEL) {
        break;
      }

      debug(`yielding ${inspect(nextVal)}`);
      yield nextVal;
    }

    return (undefined);
  }

  // But we also need to announce to clients that this can receive values
  // in their calls to next:
  return {
    [Symbol.iterator]: iterator,
    IS_AWAITERABLE: true
  };
}

module.exports = bufferedEventStream;
