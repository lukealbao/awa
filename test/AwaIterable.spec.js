'use strict';

import {test} from 'ava';
import AwaIterable from '../sources/AwaIterable';

test.beforeEach(t => {
  t.context.identity = (acc, val) => val;
  t.context.readyp = (acc) => true;
});

test('Sets a monotonically increasing integer |id| property', t => {
  const {identity, readyp} = t.context;
  const seq1 = new AwaIterable([], identity, readyp);
  const seq2 = new AwaIterable([], identity, readyp);
  const seq3 = new AwaIterable([], identity, readyp);

  t.is(seq2.id - seq1.id, 1);
  t.is(seq3.id - seq2.id, 1);
});

test('Provides |Symbol.iterator| as a generator', t => {
  const {identity, readyp} = t.context;
  const seq = new AwaIterable([], identity, readyp);

  t.is(typeof seq[Symbol.iterator], 'function');
  t.is(typeof seq[Symbol.iterator]().next, 'function');
});

test('Stops iterating when its source is consumed', t => {
  t.plan(8);

  const {identity, readyp} = t.context;
  const seq = new AwaIterable([0, 1, 2], identity, readyp);
  const iterator = seq[Symbol.iterator]();

  for (let i = 0; i < 3; i++) {
    const iteration = iterator.next();
    t.is(iteration.done, false);
    t.is(iteration.value, i);
  }

  const iteration = iterator.next();
  t.is(iteration.done, true);
  t.is(iteration.value, undefined);
});

test('inspect() displays id and nested source(s)', t => {
  const {identity, readyp} = t.context;
  const seq1 = new AwaIterable([0, 1, 2], identity, readyp);
  const seq2 = new AwaIterable(seq1, identity, readyp);
  const seq3 = new AwaIterable(seq2, identity, readyp);

  const output = seq3.inspect();
  const matches = output.match(/AwaIterable\(\d+\)/g);
  t.is(matches && matches.length, 3);
});
