'use strict';

const util = require('util');
const EventEmitter = require('events').EventEmitter;

class SlidingBuffer extends EventEmitter {
  constructor (maxLength) {
    super();

    this.__buffer__ = [];
    this.__maxLength__ = Math.max(~~maxLength, 1);
  }

  isFull () {
    return (this.__buffer__.length >= this.__maxLength__);
  }

  isEmpty () {
    return (this.__buffer__.length === 0);
  }

  push (val) {
    if (this.isFull()) {
      this.shift();
    }

    process.nextTick(this.emit.bind(this), 'push');
    return this.__buffer__.push(val);
  }

  pop () {
    if (this.__buffer__.length < 2) {
      process.nextTick(this.emit.bind(this), 'empty');
    }
    return this.__buffer__.pop();
  }

  unshift (val) {
    if (this.isFull()) {
      return this.__buffer__.pop();
    }

    process.nextTick(this.emit.bind(this), 'unshift');
    return this.__buffer__.unshift(val);
  }

  shift () {
    if (this.__buffer__.length < 2) {
      process.nextTick(this.emit.bind(this), 'empty');
    }
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
    return '{ SlidingBuffer\n'
      + `  maxLength: ${this.__maxLength__}\n`
      + `  currentLength: ${this.__buffer__.length}\n`
      + '  ' + util.inspect(this.__buffer__, {colors: true})
      + '\n}';
  }
}

module.exports = SlidingBuffer;
