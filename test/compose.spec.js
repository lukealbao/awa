// @noflow

'use strict';

import test from 'ava';
const {compose} = require('../');

test('Composes any number of 1-arity functions', t => {
  const inc = x => x + 1;

  const thrice = compose(inc, inc, inc);
  const input = 1;

  t.is(thrice(input), input + 3);
});

test('Calls functions in left-to-right order', t => {
  const inc = x => x + 1;
  const double = x => x * 2;

  const stack = compose(inc, double);
  t.is(stack(1), 4);
});
