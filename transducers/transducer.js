'use strict';

// transducer :: (reducer -> reducer, any -> boolean, null -> any)
//               -> sequence -> sequence
//
// A transducer accepts either a function, or a function and a sequence.
// Given only a function, it will return a new function that accepts the
// sequence (partial application).
//
// To create a transducer, pass the relevant functions to this factory.
//
// @transduce :: (any[, ...any]) -> any -> (<acc>, <val>) -> <acc>
//     The transducer will accept a function of type <x>. The job of
//     |transduce| is to transform function <x> into a reducer, i.e.,
//     a function with signature (<A>, <B>) -> <A>. It *must* return
//     something of the type <A>.
// @readyp :: (<acc>) -> boolean
//     When a transducer must accumulate entries from its source, it
//     will need to know when to emit the accumulated value to its client.
// @initialAcc :: () -> any
//     When a transducer accumulates entries, it will need an initial value.

const LazySequence = require('../sources/LazySequence');

// A value from a mapping transducer is always ready, there is no
// reduction needed.
function alwaysReady (acc) {
  return acc !== undefined;
}

// Likewise, since we never reduce values here, we let the accumulator
// remain undefined (which will cause alwaysReady to always be true.
function emptyAcc () {
  return (undefined);
}

function transducer (transduce, readyp = alwaysReady, initialAcc = emptyAcc) {
  return function (fn, sequence) {
    if (sequence === undefined) {
      return function (sequence) {
        return new LazySequence(sequence,
                                transduce(fn),
                                readyp,
                                initialAcc);
      };
    } else {
      return new LazySequence(sequence,
                              transduce(fn),
                              readyp,
                              initialAcc);
    }
  };
}

module.exports = transducer;
