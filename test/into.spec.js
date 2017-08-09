'use strict';

const test = require('ava');
const into = require('../sinks/into');
const sequence = require('../transducers/sequence');

test('Returns a Promise resolving its output iterable', t => {
  t.plan(1);

  return into([], [1, 2, 3])
    .then(output => {
      t.pass();
    });
});

test('Consumes sequence into resolved output iterable', async (t) => {
  t.plan(2);

  const source = [1, 2, 3];
  const output = await into([], source);

  t.deepEqual(output, source);
  t.not(output, source);
});

test('Can consume into a Set', async (t) => {
  t.plan(1);

  const source = [1, 2, 3];
  const output = await into(new Set(), source);
  const expected = new Set([1, 2, 3]);

  t.deepEqual(output, expected);
});

test('Can consume into a Map', async (t) => {
  t.plan(1);

  const source = [1, 2, 3];
  const output = await into(new Map(), source);
  const expected = new Map([[1, undefined], [2, undefined], [3, undefined]]);

  t.deepEqual(output, expected);
});

test('Treats source sequence of tuples as key/val pairs when output is a Map',
     async (t) => {
       t.plan(2);

       const source = new Map([[1, 'a'], [2, 'b']]);
       const output = await into(new Map(), source);

       t.deepEqual(output, source);
       t.not(output, source);
     });

test('Consumes a LazySequence with mixed sync/async values', async (t) => {
  t.plan(1);

  const source = sequence([1, 2, Promise.resolve(3), Promise.resolve(4)]);

  const output = await into([], source);
  t.deepEqual(output, [1, 2, 3, 4]);
});

test('Throws TypeError if output is not supported', async (t) => {
  t.plan(1);

  const source = [1, 2, 3];
  try {
    const output = await into({}, source);
  } catch (e) {
    t.true(e instanceof TypeError);
  }
});
