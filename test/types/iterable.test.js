// -*- jsx -*-
// @flow

function noop (): mixed {}

// $ExpectError: mismatched types
const a: AwaIterable<number> = new AwaIterable(
  ['f'], // A string
  x => x,
  x => true
);

// Ok: Transform input type to output type
const b: AwaIterable<number> = new AwaIterable(
  ['f'], // String in
  x => parseInt(x, 16), // Number out
  x => true
);

// Error: Non-predicate isreadyp
const c: AwaIterable<string> = new AwaIterable(
  ['f'],
  x => x,
  // $ExpectError
  x => x
);

// Error: initialAcc wrong type
// TODO: It may be the case that we begin to add accumulators which
// do not have the same type as the annotated output type for the
// iterable. It may need to be left as mixed.
const d: AwaIterable<number> = new AwaIterable(
  [1],
  x => x,
  x => true,
  // $ExpectError
  x => [x]
);

// $ExpectError: source, missing transduce, readyp
const noargs = new AwaIterable();
// $ExpectError: missing transduce, readyp
const onlysource = new AwaIterable([1]);
// $ExpectError: missing readyp
const sourceandtransduce = new AwaIterable([1], x => x);
