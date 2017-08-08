'use strict';

const debug = require('util').debuglog('lzq');

let id = 1;

function LazySequence (source, transduce, readyp, initialAccumulator) {
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

LazySequence.prototype.debug = function (...args) {
  return debug(`<LazySequence ${this.id}>`, ...args);
};

LazySequence.prototype.initialAccumulator = function () {
  return [];
};

LazySequence.prototype[Symbol.iterator] = function* () {
  const self = this;
  let i = 0;
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
          self.debug(`  Giving back to yielding source <${this.iterable.id}>`, nextIteration);
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
};

LazySequence.prototype.inspect = function () {
  return `[LazySequence ${this.id}] source: ${this.iterable}`;
};

module.exports = LazySequence;
