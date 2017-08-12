'use strict';

// Avoid circular references. Multiple modules need this.
module.exports.SENTINEL
  = (typeof Symbol === 'function' && typeof Symbol.for === 'function')
  ? Symbol.for('awa.sentinel')
  : '@@AWA_SENTINEL';

module.exports = Object.assign(module.exports, {
  map: require('./transducers/map'),
  filter: require('./transducers/filter'),
  sequence: require('./transducers/sequence'),
  eventStream: require('./transducers/event-stream'),
  into: require('./sinks/into'),
  loop: require('./sinks/forEach'),
  compose: require('./lib/compose')
});
