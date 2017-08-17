'use strict';

import {test} from 'ava';
const split = require('../dist/transducers/split');

test('Splits on split', t => {
  const input = [
    'line 1\n',
    'li',
    'ne 2\nline 3',
    '\nline ',
    '4\nline',
    ' 5\n',
    'end\n'
  ];

  function onNewline (str) {
    return str.split(/\n/);
  }

  const output = [...split(onNewline, input)];
  t.deepEqual(output, [
    'line 1', 'line 2', 'line 3',
    'line 4', 'line 5', 'end', '' // <- trailing newline gives empty string
  ]);
});

test('Splits an empty input', t => {
  function onNewline (str) {
    return str.split(/\n/);
  }

  const output = [...split(onNewline, [])];
  t.deepEqual(output, []);
});
