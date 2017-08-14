// -*- jsx -*-
// @flow

// Ordinary production
let a: AwaIteration<string> = {done: false, value: 'foo'};

// $ExpectError: Done must have undefined value
let b: AwaIteration<string> = {done: true, value: 'foo'};
let c: AwaIteration<string> = {done: true, value: undefined};

// An iteration with type T may be emitted as a Promise
let f: AwaIteration<string> = {done: false, value: Promise.resolve('foo')};
// If you want an async Iteration, you must type it explicitly.
let g: AwaIteration<Promise<string>> = {done: false, value: Promise.resolve('foo')};
// But mostly you'll want to have a union
let h: AwaIteration<string | Promise<string>> = {done: false, value: 'foo'};


