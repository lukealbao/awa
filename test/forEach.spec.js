// @noflow

'use strict';

const test = require('ava');
const {forEach, sequence} = require('../');

test('Returns a Promise resolving the number of entries processed', t => {
  t.plan(1);

  return forEach(() => (null), [1, 2, 3])
    .then(count => {
      t.is(count, 3);
    });
});

test('Processes each input', t => {
  t.plan(3);

  return forEach(() => t.pass(), [1, 2, 3]);
});

test('Handles mixed async/sync values', t => {
  const acc = [];
  const source = sequence([1, Promise.resolve(2), Promise.resolve(3)]);

  return forEach(n => acc.push(n), source)
    .then(() => t.deepEqual(acc, [1, 2, 3]));
});
