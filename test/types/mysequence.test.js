// -*- jsx -*-
// @flow


// $ExpectError: Annotated strings out, but numbers in
const strings: LSequence<string> = mysequence([1]);
// Ok: numbers in, numbers out
const numbers: LSequence<number> = mysequence([1]);
// $ExpectError: if annotated, input must contain one type
const mixedseq: LSequence<number> = mysequence([1, '2']);
// Ok
const okmixedseq: LSequence<string|number> = mysequence([1, '2']);



