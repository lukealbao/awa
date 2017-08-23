'use strict';

const SENTINEL
  = (typeof Symbol === 'function' && typeof Symbol.for === 'function')
  ? Symbol.for('awa.sentinel')
      : '@@AWA_SENTINEL';

const AwaIterable = require('./sources/AwaIterable.js');

const forEach = require('./sinks/forEach.js');
const into = require('./sinks/into.js');
const take = require('./transducers/take.js');

const transducer = require('./transducers/transducer.js');
const map = require('./transducers/map.js');
const filter = require('./transducers/filter.js');
const sequence = require('./transducers/sequence.js');
const flatten = require('./transducers/flatten.js');
const split = require('./transducers/split.js');
const eventStream = require('./transducers/event-stream.js');
const bufferedEventStream = require('./transducers/buffered-event-stream.js');

const compose = require('./lib/compose.js');

module.exports = {
  SENTINEL: SENTINEL,
  Iterable: AwaIterable,
  forEach: forEach,
  into: into,
  take: take,
  transducer: transducer,
  map: map,
  filter: filter,
  sequence: sequence,
  eventStream: eventStream,
  bufferedEventStream: bufferedEventStream,
  flatten: flatten,
  split: split,
  compose: compose
};
