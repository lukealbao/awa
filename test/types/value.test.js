// -*- jsx -*-
// @flow

// SENTINEL is a very primitive ENUM-like value for stopping an iteration.
// There is a Symbol-based one for environments which support it, and a
// String-based one for those which do not.
import type {SENTINEL} from '../..';
const es6Sentinel: SENTINEL = Symbol.for('awa.sentinel');
const es5Sentinel: SENTINEL = '@@AWA_SENTINEL';
// $ExpectError
const unknownSentinel: SENTINEL = '@@awa_sentinel';


// Values are emitted by Awa.Iterables. They are typed and may be a sentinel
// value other than the annotated type.

const a: AwaValue<string> = 'foo';
const b: AwaValue<number> = 3;
const c: AwaValue<string[]> = ['foo', 'bar'];
const d: AwaValue<Promise<string>> = Promise.resolve('foo');

const e: AwaValue<string> = '@@AWA_SENTINEL';
const f: AwaValue<string> = Symbol.for('awa.sentinel');

// A value of type T may be emitted as a Promise
const g: AwaValue<string> = Promise.resolve('foo');
