/* eslint-disable max-depth */

'use strict';

const util = require('util');
const debug = util.debuglog('lzq');

let id = 1;

class LazySequence {
  constructor (source, transduce, readyp, initialAccumulator) {
    this.source = source[Symbol.iterator]();
    this.iterable = source;
    this.transduce = transduce;
    this.isReady = readyp;
    this.consumed = false;
    this.id = id++;

    if (typeof initialAccumulator === 'function') {
      this.initialAccumulator = initialAccumulator;
    }
  }

  debug (...args) {
    return debug(`<LazySequence ${this.id}>`, ...args);
  }

  initialAccumulator () {
    return [];
  }

  *[Symbol.iterator] () {
    const self = this;
    self.debug('creating iterator');

    // Outer loop generates values until source iterator is done.
    // TODO: Where does that happen that we identify consumed state? Or do we
    // only rely on the client to stop calling next?
    while (!self.consumed) {
      let ready = false;
      let acc = self.initialAccumulator();

      // Inner loop accumulates values off of the source iterator.
      while (!ready) {
        let nextIteration = self.source.next();
        let next = nextIteration.value;
        self.debug(`Took from source <${this.iterable.id}>`, next);

        while (next && typeof next.then === 'function') {
          // Let caller resolve function
          self.debug('  (Yielding for client resolution)');
          nextIteration = yield next;

          self.debug('Client resolved', nextIteration);

          // PROBLEM: If source is a LazyFunction, we need to yield back to it
          // in order to get all the transducers there.
          // Cf. event-stream TODO#1
          if (self.iterable instanceof LazySequence) {
            self.debug(`  Giving back to yielding source <${this.iterable.id}>`,
                       nextIteration);
            nextIteration = self.source.next(nextIteration);
          }

          next = nextIteration.value;
        } // else {
        //   self.debug('  (Synchronous)');
        // }

        // TODO: is this enough to ensure Hickey's rule that "... if a
        // transducing process or a transducer gets a reduced
        // value, it must never call a step function with input again."
        if (nextIteration.done) return;

        // Transduce
        self.debug(`transduce(${acc}, ${nextIteration.value})`);
        acc = self.transduce(acc, nextIteration.value);
        self.debug(`  -> acc is now`, acc);

        // isReady?
        ready = self.isReady(acc);
        self.debug(`ready? ${ready}`);
      }

      // Reduced, yield next ready value.
      self.debug(`yield reduced value`, acc);
      yield acc;
    }
  }

  inspect () {
    return `[LazySequence(${this.id}) source: ${util.inspect(this.iterable)}]`;
  }
}

module.exports = LazySequence;
