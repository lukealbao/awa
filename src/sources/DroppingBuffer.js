'use strict';

const util = require('util');

class DroppingBuffer {
  constructor (maxLength) {
    this.__buffer__ = [];
    this.__maxLength__ = Math.max(~~maxLength, 1);
  }

  isFull () {
    return (this.__buffer__.length >= this.__maxLength__);
  }

  push (val) {
    if (this.isFull()) {
      return this.__buffer__.length;
    } else {
      return this.__buffer__.push(val);
    }
  }

  pop () {
    return this.__buffer__.pop();
  }

  unshift (val) {
    if (this.isFull()) {
      return this.__buffer__.length;
    } else {
      return this.__buffer__.unshift(val);
    }
  }

  shift () {
    return this.__buffer__.shift();
  }

  toJSON () {
    return {
      maxLength: this.__maxLength__,
      currentLength: this.__buffer__.length,
      contents: this.__buffer__
    };
  }

  inspect () {
    return '{ DroppingBuffer\n'
      + `  maxLength: ${this.__maxLength__}\n`
      + `  currentLength: ${this.__buffer__.length}\n`
      + '  ' + util.inspect(this.__buffer__, {colors: true})
      + '\n}';
  }
}

module.exports = DroppingBuffer;
