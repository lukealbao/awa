'use strict';

const debug = require('util').debuglog('awa/eventstream');
const SENTINEL = Symbol.for('awa.sentinel');

function pause (emitter) {
  (typeof emitter.pause === 'function')  && emitter.pause();
}

function resume (emitter) {
  (typeof emitter.resume === 'function')  && emitter.resume();
}

// A plain, unbuffered event stream, which has no end.
function eventStream (emitter, event, end) {
  function* iterator () {
    let done = false;
    let nexts = 1;
    let yields = 1;

    function future () {
      process.nextTick(() => resume(emitter));
      return new Promise(resolve => {
        let resolved = false;

        if (end !== undefined) {
          emitter.once(end, () => {
            pause(emitter);
            if (!resolved) {
              debug(`next called ${nexts} times`);
              debug(`yielded ${yields} values`);
              resolved = true;
              resolve(SENTINEL);
            }
            emitter.removeListener(event, resolve);
          });
        };

        emitter.once(event, v => {
          pause(emitter);
          if (!resolved) {
            nexts++;
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
      yields++;

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
