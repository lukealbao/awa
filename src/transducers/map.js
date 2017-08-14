'use strict';

const transducer = require('./transducer');

function mapperToReducer (fn) {
  return function (acc, val) {
    // Step function just replaces accumulator with mapping of value.
    // This causes readyp to return true after every value.
    acc = fn(val);
    return acc;
  };
}

const map = transducer(mapperToReducer);

module.exports = map;
