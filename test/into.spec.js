'use strict';

const test = require('ava');
const into = require('../sinks/into');
const LazySequence = require('../sources/LazySequence');

test.beforeEach(t => {
  t.context.identity = (acc, val) => val;
  t.context.readyp = (acc) => true;
});

test('Returns a Promise resolving its output iterable', t => {
  t.plan(1);

  return into([], [1, 2, 3])
    .then(output => {
      t.pass();
    });
});

test('Consumes sequence into resolved output iterable', async (t) => {
  t.plan(2);

  const input = [1, 2, 3];
  const output = await into([], input);

  t.deepEqual(output, input);
  t.not(output, input);
});

test('Can consume into a Set', async (t) => {
  t.plan(1);

  const input = [1, 2, 3];
  const output = await into(new Set(), input);
  const expected = new Set([1, 2, 3]);

  t.deepEqual(output, expected);
});

test('Can consume into a Map', async (t) => {
  t.plan(1);

  const input = [1, 2, 3];
  const output = await into(new Map(), input);
  const expected = new Map([[1, undefined], [2, undefined], [3, undefined]]);

  t.deepEqual(output, expected);
});

test('Treats input sequence of tuples as key/val pairs when output is a Map',
     async (t) => {
       t.plan(2);

       const input = new Map([[1, 'a'], [2, 'b']]);
       const output = await into(new Map(), input);

       t.deepEqual(output, input);
       t.not(output, input);
     });

test('Consumes a LazySequence with mixed sync/async values', async (t) => {
  t.plan(1);

  const {identity, readyp} = t.context;
  const source = [1, 2, Promise.resolve(3), Promise.resolve(4)];
  const sequence = new LazySequence(source, identity, readyp);

  const output = await into([], sequence);
  t.deepEqual(output, [1, 2, 3, 4]);
});
