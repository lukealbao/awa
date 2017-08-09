// @flow
'use strict';

import test from 'ava';
import map from '../transducers/map';
import filter from '../transducers/filter';
import into from '../sinks/into';
import compose from '../lib/compose';
import sequence from '../transducers/sequence';

test('Asynchronous map/filter transducer stack', async (t) => {
  const source = sequence([1, 2, Promise.resolve(3), Promise.resolve(4),
    5, Promise.resolve(6), 7, Promise.resolve(8)]);

  const double = map(x => x * 2);
  const inc = map(x => x + 1);
  const isUnder5 = filter(x => x < 5);

  const transform = compose(isUnder5, double, inc);
  const input = transform(source);

  const output = await into([], input);

  // isUnder5(1..9) -> double(1,2,3,4) -> inc(2,4,6,8) -> (3,5,7,9)
  t.deepEqual(output, [3, 5, 7, 9]);
});

