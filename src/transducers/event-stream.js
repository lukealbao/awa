'use strict';

const debug = require('util').debuglog('awa/eventstream');
const SENTINEL = Symbol.for('awa.sentinel');

// A plain, unbuffered event stream, which has no end.
function eventStream (emitter, event, end) {
  function* iterator () {
    let done = false;

    function future () {
      return new Promise(resolve => {
        let resolved = false;

        if (end !== undefined) {
          emitter.once(end, () => {
            if (!resolved) {
              resolved = true;
              resolve(SENTINEL);
            }
            emitter.removeListener(event, resolve);
          });
        };

        emitter.once(event, v => {
          if (!resolved) {
            resolved = true;
            resolve(v);
          }
          if (end !== undefined) {
            emitter.removeListener(end, resolve);
          }
        });
      });
    }

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
