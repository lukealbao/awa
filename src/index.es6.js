'use strict';

const SENTINEL
  = (typeof Symbol === 'function' && typeof Symbol.for === 'function')
  ? Symbol.for('awa.sentinel')
      : '@@AWA_SENTINEL';

import {Iterable} from './sources/AwaIterable.js';

import {forEach} from './sinks/forEach.js';
import {into} from './sinks/into.js';

import {transducer} from './transducers/transducer.js';
import {map} from './transducers/map.js';
import {filter} from './transducers/filter.js';
import {sequence} from './transducers/sequence.js';
import {eventStream} from './transducers/event-stream.js';

import {compose} from './lib/compose.js';

export default {
  SENTINEL: SENTINEL,
  Iterable: Iterable,
  forEach: forEach,
  into: into,
  transducer: transducer,
  map: map,
  filter: filter,
  sequence: sequence,
  eventStream: eventStream,
  compose: compose
};

export {
  Iterable,
  forEach,
  into,
  transducer,
  map,
  filter,
  sequence,
  eventStream,
  compose
};
