'use strict';

import {test} from 'ava';
import sequence from '../transducers/sequence';
import into from '../sinks/into';

test('Accepts an iterable and returns a transducer', async (t) => {
  const arr = [1, 2, 3, 4];
  const s = sequence(arr);

  const output = await into([], s);
  t.deepEqual(output, arr);
  t.not(output, arr);
});
