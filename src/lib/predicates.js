'use strict';

// any => boolean
function isIterable (thing) {
  return !!(
    thing
      && (typeof thing[Symbol.iterator] === 'function'
          || typeof thing['@@iterator'] === 'function')
  );
}

// any => boolean
function isAwaIterable (thing) {
  return thing
    && !!(thing.IS_AWAITERABLE || thing[Symbol.for('is_awaiterable')]);
}

// any => (iterator | void)
function getIterator (thing) {
  return !!thing && (
    thing[Symbol.iterator]
    || thing['@@iterator']
  );
}

// any => boolean
function isPromise (thing) {
  return (thing instanceof Promise)
    || (thing && typeof thing.then === 'function');
}

module.exports.isPromise = isPromise;
module.exports.isAwaIterable = isAwaIterable;
