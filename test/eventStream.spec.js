// @flow
'use strict';

import test from 'ava';
import {into, eventStream} from '../';
import EventEmitter from 'events';

test('Attach a sink to an unfinished event stream', async (t) => {
  t.plan(1);

  const emitter = new EventEmitter();
  const stream = eventStream(emitter, 'data', 'end');

  const listener = into([], stream);

  for (let i = 1; i < 4; i++) {
    emitter.emit('data', i);
  }

  emitter.emit('end', 'bye!');

  return listener
    .then(output => {
      t.deepEqual(output, [1, 2, 3]);
    });
});

test('Attach a sink to a finished but buffered event stream', async (t) => {
  t.plan(1);

  const emitter = new EventEmitter();
  const stream = eventStream(emitter, 'data', 'end');

  for (let i = 1; i < 4; i++) {
    emitter.emit('data', i);
  }

  emitter.emit('end', 'bye!');

  const output = await into([], stream);
  t.deepEqual(output, [1, 2, 3]);
});
