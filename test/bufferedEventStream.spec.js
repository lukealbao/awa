// @noflow
'use strict';

import test from 'ava';
const {SENTINEL, into, bufferedEventStream} = require('../');
import EventEmitter from 'events';
const {
  isPromise,
  isAwaIterable
} = require('../src/lib/predicates');

test('Attach a sink to an unfinished event stream', async (t) => {
  t.plan(1);

  const emitter = new EventEmitter();
  const stream = bufferedEventStream(emitter, 'data', 'end');

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
  const stream = bufferedEventStream(emitter, 'data', 'end');

  for (let i = 1; i < 4; i++) {
    emitter.emit('data', i);
  }

  emitter.emit('end', 'bye!');

  const output = await into([], stream);
  t.deepEqual(output, [1, 2, 3]);
});

test('Create two streams from same emitter', async (t) => {
  t.plan(2);

  const emitter = new EventEmitter();
  const stream1 = bufferedEventStream(emitter, 'data', 'end');
  const stream2 = bufferedEventStream(emitter, 'data', 'end');

  for (let i = 1; i < 4; i++) {
    emitter.emit('data', i);
  }

  emitter.emit('end', 'bye!');

  const output1 = await into([], stream1);
  const output2 = await into([], stream2);
  t.deepEqual(output1, [1, 2, 3]);
  t.deepEqual(output2, [1, 2, 3]);
});

test('Emitting no events before ending is ok', async (t) => {
  t.plan(1);

  const emitter = new EventEmitter();
  const stream = bufferedEventStream(emitter, 'data', 'end');

  emitter.emit('end', 'bye!');

  const output = await into([], stream);
  t.deepEqual(output, []);
});

test('Emitting a single event before ending is ok', async (t) => {
  t.plan(1);

  const emitter = new EventEmitter();
  const stream = bufferedEventStream(emitter, 'data', 'end');

  emitter.emit('data', 1);
  emitter.emit('end', 'bye!');

  const output = await into([], stream);
  t.deepEqual(output, [1]);
});

test('Two streams from same emitter receive separate objects!', async (t) => {
  t.plan(2);

  const emitter = new EventEmitter();
  const stream1 = bufferedEventStream(emitter, 'data', 'end');
  const stream2 = bufferedEventStream(emitter, 'data', 'end');

  emitter.emit('data', {value: 'pass by reference'});
  emitter.emit('data', {value: 'pass by reference'});
  emitter.emit('end', 'bye!');

  const output1 = await into([], stream1);
  const output2 = await into([], stream2);
  t.not(output1[0], output2[0]);
  t.deepEqual(output1[0], output2[0]);
});
