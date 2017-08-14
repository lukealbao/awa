// @flow

// Values are emitted by Awa.Iterables. They are typed and may be a sentinel
// value other than the annotated type.

const a: AwaValue<string> = 'foo';
const b: AwaValue<number> = 3;
const c: AwaValue<string[]> = ['foo', 'bar'];
const d: AwaValue<Promise<string>> = Promise.resolve('foo');

const e: AwaValue<string> = '@@AWA_SENTINEL';
const f: AwaValue<string> = Symbol.for('awa.sentinel');
