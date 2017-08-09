// @flow

'use strict';

const transducer = require('./transducer');

function filtererToReducer (fn) {
  return function (acc, val) {
    // Step function just replaces accumulator with mapping of value.
    // This causes readyp to return true after every value.
    if (fn(val)) {
      acc = val;
    }

    return acc;
  };
}

const filter = transducer(filtererToReducer);
module.exports = filter;
