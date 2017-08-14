// -*- jsx -*-
// @flow

// Ordinary typed production
const a: AwaIterator<string> = {
  next: function () { return { done: false, value: 'foo' }; }
};

// Asynchronous typed production
const b: AwaIterator<string> = {
  next: function () { return { done: false, value: Promise.resolve('foo') }; }
};

// Number type, but emits a sentinel
const c: AwaIterator<number> = {
  next: function () { return { done: false, value: Promise.resolve('@@AWA_SENTINEL') }; }
};

// $ExpectError: Type is number, emits string.
const d: AwaIterator<number> = {
  next: function () { return { done: false, value: Promise.resolve('foo')}; }
};

// Typed iterator emitting (undefined) is ok
const e: AwaIterator<number> = {
  next: function () { return { done: false, value: undefined }; }
};

// Variance
const f: AwaIterator<string | number> = {
  next: function () { return { done: false, value: 'foo' }; }
};
