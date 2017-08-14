/* eslint-disable max-len */
/* eslint-disable max-depth */

var util = require('util');
var copy = util._extend;
var debug = console.log;//util.debuglog('dc');

module.exports = function deepCopy (source, cache=new Map()) {
  const output = {};
  cache.set(source, output);

  for (const k in source) {
    const v = source[k];
    if (typeof v !== 'function' && !util.isPrimitive(v)) {
      if (! cache.has(v)) {
        output[k] = deepCopy(v, cache);
        cache.set(v, output[k]);
      } else {
        output[k] = cache.get(v);
      }
    } else {
      output[k] = v;
    }
  }

  return output;
};

