// -*- jsx -*-
// @flow

// ----------------
// ---- 2-arity ---
// ----------------
// $ExpectError: mapper is any->number, wants any->string
const atois: LSequence<string> = map(x => parseInt(x, 10), ['a']);
// Ok
const itoas: LSequence<string> = map(x => x + '1', [5]);
// $ExpectError: Input source cannot be mapped with mapping fn.
const tooPrimitive: LSequence<any> = map(x => x.foo, ['a', 'b']);

// ----------------
// ---- 1-arity ---
// ----------------
const double = map((n: number) => n * 2);
// $ExpectError: Input array is of wrong type for mapping fn.
const wrongInput = double(['1']);
// Ok
const doubles = double([1,2,3]);
// $ExpectError: Type of output will be inferred by mapping fn and input.
const doubleStrings: LSequence<string> = double([1]);
