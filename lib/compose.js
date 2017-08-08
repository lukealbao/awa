'use strict';

function compose (...fns) {
  return function (arg) {
    for (const fn of fns) {
      arg = fn(arg);
    }

    return arg;
  };
}

module.exports = compose;
