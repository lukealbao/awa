'use strict';

const debug = require('util').debuglog('awa/eventstream');
const SENTINEL = Symbol.for('awa.sentinel');
function noop () {}

// A plain, unbuffered event stream, which has no end.
function eventStream (emitter, event, end) {
  function* iterator () {
    let done = false;    
    
    function future () {
      return new Promise(resolve => {
        let resolved = false;
        emitter.once(end, _ => {
          if (!resolved) {
            resolved = true;
            resolve(SENTINEL);
          }
        });
        emitter.once(event, v => {
           if (!resolved) {
            resolved = true;
            resolve(v);
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
