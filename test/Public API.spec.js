'use strict';

import {test} from 'ava';
const awa = require('../');

test('awa.SENTINEL is a Symbol', t => {
  t.plan(1);

  if (typeof Symbol === undefined) {
    t.is(awa.SENTINEL, '@@AWA_SENTINEL');
  } else {
    t.is(awa.SENTINEL, Symbol.for('awa.sentinel'));
  }
});


