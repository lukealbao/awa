'use strict';

import test from 'ava';
const {
  eventStream,
  into,
  sequence,
  SENTINEL,
  take
} = require('../');
import EventEmitter from 'events';


test('Used on static input, is subject to spread operator', t => {
  const source = [1, 2, 3, 4, 5];
  const iter = take(5, source);
  t.deepEqual([...iter], source);
});

test('Works with Promises if consumed by a sink', async (t) => {
  const source = sequence([1, Promise.resolve(2), 3, 4, Promise.resolve(5), 6, 7]);
  const iter = take(5, source);

  const sink = await into([], iter);
  t.deepEqual(sink, [1, 2, 3, 4, 5]);
});

test(`Stops an eventStream's iterator`, async (t) => {
  t.plan(2);

  function timeout (promise, ms) {
    return new Promise((resolve, reject) => {
      let ok = undefined;
      setTimeout(() => {
        if (ok === undefined) {
          ok = false;
          reject(new Error('Timeout'));
        }
      }, ms);

      promise.then(val => (
        (ok === undefined) && (ok = true) && resolve(val)
      ));
    });
  }

  const emitter = new EventEmitter();
  const stream = eventStream(emitter, 'data');

  var i = 1;
  setInterval(() => emitter.emit('data', i++), 0);

  const five = await into([], take(5, stream));
  t.deepEqual(five, [1, 2, 3, 4, 5]);

  // An ordinary stream will never emit done, so into will not
  // resolve on its own.
  return timeout(into([], stream), 200)
    .catch(err => t.pass());
});
