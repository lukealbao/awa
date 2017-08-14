// @flow

'use strict';

import {transducer, Iterable} from '../';
import test from 'ava';

test.beforeEach(t => {
  function identity (x) { return x; }
  t.context.id = transducer(identity);
});

test('(fn) -> (sequence) -> sequence', t => {
  const tform = t.context.id(x => x);
  t.is(typeof tform, 'function');

  const sequence = tform([1, 2, 3]);
  t.true(sequence instanceof Iterable);
});

test('(fn, sequence) -> sequence', t => {
  const source = [];
  const tform = t.context.id(x => x, source);

  t.true(tform instanceof Iterable);
});
