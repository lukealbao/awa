// @flow

'use strict';

import test from 'ava';
import {filter, into, compose} from '../';

test('(any -> boolean) -> (sequence) -> sequence', async (t) => {
  const isEven = filter(x => x % 2 === 0);
  const source = [1, 2, 3];

  const output = await into([], isEven(source));
  t.deepEqual(output, [2]);
});

test('Can be composed', async (t) => {
  const isEven = filter(x => x % 2 === 0);
  const isOver10 = filter(x => x > 10);
  const evenDoubleDigits = compose(isEven, isOver10);
  const source = [1, 2, 3];

  const output = await into([], evenDoubleDigits(source));
  t.deepEqual(output, []);
});
