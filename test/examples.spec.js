// @noflow
'use strict';

import test from 'ava';
const {map, filter, into, compose, sequence, eventStream} = require('../');
import EventEmitter from 'events';

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

test('Multiple consumers on a single source', async (t) => {
  const source = new EventEmitter();

  const evenp = filter(x => x % 2 === 0);
  const oddp = filter(x => x % 2 !== 0);

  const evenstream = evenp(eventStream(source, 'data', 'end'));
  const oddstream = oddp(eventStream(source, 'data', 'end'));

  let evens = into([], evenstream);
  let odds = into([], oddstream);

  for (var i = 0; i < 5; i++) source.emit('data', i);
  source.emit('end');

  evens = await evens;
  odds = await odds;

  t.deepEqual(odds, [1, 3]);
  t.deepEqual(evens, [0, 2, 4]);
});
