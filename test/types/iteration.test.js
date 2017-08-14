// @flow

// Ordinary production
let a: AwaIteration<string> = {done: false, value: 'foo'};

// $ExpectError: Done must have undefined value
let b: AwaIteration<string> = {done: true, value: 'foo'};
let c: AwaIteration<string> = {done: true, value: undefined};

// $ExpectError: Undone must have value...
let d: AwaIteration<string> = {done: false, value: undefined};
// ... unless typed as such
let e: AwaIteration<string | void> = {done: false, value: undefined};

// $ExpectError: Iterations are typed T, but T is not a Promise
let f: AwaIteration<string> = {done: false, value: Promise.resolve('foo')};


