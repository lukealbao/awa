// @flow

// No-ops that just make this large test file a little bit easier to read.
function ok (explanation, context) {
}
function fails (explanation, context) {
}

// --------------------------------------------------
// ----            @Public: SENTINEL             ----
// --------------------------------------------------
import type {SENTINEL} from '../';

const es6Sentinel: SENTINEL = Symbol.for('awa.sentinel');
const es5Sentinel: SENTINEL = '@@AWA_SENTINEL';

// --------------------------------------------------
// ----            @Public: Iterable             ----
// --------------------------------------------------
import {AwaIterable} from '../';
const noop = () => (undefined);

ok('Untyped constructor(Iterable<T>, function, function, function?)', () => {
  let defaultAcc = new AwaIterable([1], noop, noop);
  let customAcc = new AwaIterable([1], noop, noop, noop);  
});

ok('Typed constructor(Iterable<T>, function, function, function?)', () => {
  let a: AwaIterable<number, number> = new AwaIterable([1], noop, noop);
  let b: AwaIterable<number, number> = new AwaIterable([1], noop, noop, x => x*2);
});

fails('Missing input sources', () => {
  // $ExpectError: source, transduce, readyp
  let seq = new AwaIterable();
  // $ExpectError: transduce, readyp
  let seq = new AwaIterable([1]);
  // $ExpectError: readyp
  let seq = new AwaIterable([1], x => x);
});

fails('Input type mismatches annotation', () => {
  // $ExpectError  
  let seq: AwaIterable<number, number> = new AwaIterable(
    ['f'],
    x => x,
    x => x
  );
});

// --------------------------------------------------
// ----        @Private: AwaIterator             ----
// --------------------------------------------------
import type {AwaIteration, AwaIterator} from '../';

fails('Iteration types inherit from Iterable', () => {
  let customAcc = new AwaIterable([1], noop, noop, noop);  
  const iterator: AwaIterator<number> = customAcc.getIterator();
  let bad: AwaIteration<number> = iterator.next();
  // $ExpectError
  let bad: AwaIteration<string> = iterator.next();
});

// ok('Accesses iteration value', () => {
//   let iteration = iterator.next();
//   const double = iteration.value * 2;
// });

// fails('Accesses non-AwaIteration values', () => {
//   let iteration: AwaIteration<number> = iterator.next();
//   const double = iteration.oops;
// });

