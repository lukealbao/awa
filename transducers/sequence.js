'use strict';

const transducer = require('./transducer');

function identityReducer () {
  return function (acc, val) {
    // Step function just replaces accumulator with mapping of value.
    // This causes readyp to return true after every value.
    acc = val;

    return acc;
  };
}

const sequence = transducer(identityReducer)();

module.exports = sequence;
