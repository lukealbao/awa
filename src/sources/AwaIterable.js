/* eslint-disable max-depth */

'use strict';

const util = require('util');
const debug = util.debuglog('awa/iterable');

let id = 1;

class AwaIterable {
  constructor (source, transduce, readyp, initialAccumulator) {
    this.IS_AWAITERABLE = true;
    this.source = source[Symbol.iterator]();
    this.iterable = source;
    this.transduce = transduce;
    this.isReady = readyp;
    this.consumed = false;
    this.id = id++;
    this['@@iterator'] = this[Symbol.iterator];

    if (typeof initialAccumulator === 'function') {
      this.initialAccumulator = initialAccumulator;
    }
  }

  debug (...args) {
    return debug(`<AwaIterable ${this.id}>`, ...args);
  }

  initialAccumulator () {
    return [];
  }

  *[Symbol.iterator] () {
    const self = this;

    // Outer loop generates values until source iterator is done.
    // TODO: Where does that happen that we identify consumed state? Or do we
    // only rely on the client to stop calling next?
    while (!self.consumed) {
      let ready = false;
      let acc = self.initialAccumulator();

      // Inner loop accumulates values off of the source iterator.
      while (!ready) {
        let next = self.source.next();
        self.debug(`Took from source <${this.iterable.id}>`, next.value);

        // This whole block is just a monad to resolve a promise.
        while (next.value && typeof next.value.then === 'function') {
          // Let caller resolve function
          self.debug('  (Yielding for client resolution)');
          next.value = yield next.value; // T -> T

          self.debug('Client resolved', next.value);

          // PROBLEM: If source is a LazyFunction, we need to yield back to it
          // in order to get all the transducers there.
          // Cf. event-stream TODO#1
          if (self.iterable.IS_AWAITERABLE) {// || self.iterable instanceof AwaIterable) {
            self.debug(`  Giving back to yielding source <${this.iterable.id}>`,
                       next.value);
            next = self.source.next(next.value);
          }
        }

        // TODO: is this enough to ensure Hickey's rule that "... if a
        // transducing process or a transducer gets a reduced
        // value, it must never call a step function with input again."
        if (next.done) return;

        // Transduce
        //self.debug(`transduce(${acc}, ${next.value})`);
        acc = self.transduce(acc, next.value); // TODO: simplify this reference tangle
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
    return `[AwaIterable(${this.id}) source: ${util.inspect(this.iterable)}]`;
  }
}

module.exports = AwaIterable;
