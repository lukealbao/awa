'use strict';

const debug = require('util').debuglog('awa/eventstream');
const SENTINEL = Symbol.for('awa.sentinel');

// A plain, unbuffered event stream, which has no end.
function eventStream (emitter, event) {
  function future () {
    return new Promise(resolve => {
      emitter.once(event, resolve);
    });
  }

  function* iterator () {
    let done = false;

    while (!done) {
      // Yield for Promise resolution
      const nextVal = yield future();

      if (nextVal === SENTINEL) {
        debug('Received sentinel, finishing now');
        done = true;
        return;
      }

      // Yield for value production
      yield nextVal;
    }
  }

  return {
    [Symbol.iterator]: iterator,
    IS_AWAITERABLE: true
  };
}

module.exports = eventStream;
