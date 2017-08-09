'use strict';

import {test} from 'ava';
import LazySequence from '../sources/LazySequence';

test.beforeEach(t => {
  t.context.identity = (acc, val) => val;
  t.context.readyp = (acc) => true;
});

test('Sets a monotonically increasing integer |id| property', t => {
  const {identity, readyp} = t.context;
  const seq1 = new LazySequence([], identity, readyp);
  const seq2 = new LazySequence([], identity, readyp);
  const seq3 = new LazySequence([], identity, readyp);

  t.is(seq2.id - seq1.id, 1);
  t.is(seq3.id - seq2.id, 1);
});

test('Provides |Symbol.iterator| as a generator', t => {
  const {identity, readyp} = t.context;
  const seq = new LazySequence([], identity, readyp);

  t.is(typeof seq[Symbol.iterator], 'function');
  t.is(typeof seq[Symbol.iterator]().next, 'function');
});

test('Stops iterating when its source is consumed', t => {
  t.plan(8);

  const {identity, readyp} = t.context;
  const seq = new LazySequence([0, 1, 2], identity, readyp);
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
  const seq1 = new LazySequence([0, 1, 2], identity, readyp);
  const seq2 = new LazySequence(seq1, identity, readyp);
  const seq3 = new LazySequence(seq2, identity, readyp);

  const output = seq3.inspect();
  const matches = output.match(/LazySequence\(\d+\)/g);
  t.is(matches && matches.length, 3);
});
