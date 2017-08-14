'use strict';

const SENTINEL
  = (typeof Symbol === 'function' && typeof Symbol.for === 'function')
  ? Symbol.for('awa.sentinel')
      : '@@AWA_SENTINEL';

const AwaIterable = require('./sources/AwaIterable.js');

const forEach = require('./sinks/forEach.js');
const into = require('./sinks/into.js');

const transducer = require('./transducers/transducer.js');
const map = require('./transducers/map.js');
const filter = require('./transducers/filter.js');
const sequence = require('./transducers/sequence.js');
const eventStream = require('./transducers/event-stream.js');

const compose = require('./lib/compose.js');

module.exports = {
  SENTINEL: SENTINEL,
  Iterable: AwaIterable,
  forEach: forEach,
  into: into,
  transducer: transducer,
  map: map,
  filter: filter,
  sequence: sequence,
  eventStream: eventStream,
  compose: compose
};
