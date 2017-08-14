'use strict';

import test from 'ava';
const {map, into, compose} = require('../');

test('(any -> any) -> (sequence) -> sequence', async (t) => {
  const double = map(x => x * 2);
  const source = [1, 2, 3];

  const output = await into([], double(source));
  t.deepEqual(output, [2, 4, 6]);
});

test('Can be composed', async (t) => {
  const double = map(x => x * 2);
  const inc = map(x => x + 1);
  const doubleThenIncrement = compose(double, inc);
  const source = [1, 2, 3];

  const output = await into([], doubleThenIncrement(source));
  t.deepEqual(output, [3, 5, 7]);
});
