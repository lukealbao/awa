// @noflow
'use strict';

import test from 'ava';
const {SENTINEL, into, eventStream, take} = require('../');
import EventEmitter from 'events';

test('Unbuffered event stream', t => {
  const emitter = new EventEmitter();

  var i = 0;
  setInterval(() => emitter.emit('data', i++), 0);
  const stream = take(5, eventStream(emitter, 'data'));

  return into([], stream).then(output => {
    t.deepEqual(output, [0, 1, 2, 3, 4]);
  });
});

test('Still may produce values for other sinks after sentinel', async (t) => {
  const emitter = new EventEmitter();
  const stream = eventStream(emitter, 'data');

  var i = 1;
  setInterval(() => emitter.emit('data', i++), 0);

  const five = await into([], take(5, stream));
  t.deepEqual(five, [1, 2, 3, 4, 5]);

  // Iterator is still available. `take` will open a new one.
  const restarts = await into([], take(2, stream));
  t.deepEqual(restarts, [6, 7]);
});
