// @noflow

'use strict';

// compose:
// <A..N> (fna: FN<A,any>,..., fnn: <M, N>) => N

const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

function generateParams (n) {
  const A0 = parseInt('A0', 16);
  const params = [];

  for (let i = A0; i < (n + A0); i++) {
    params.push(i.toString(16).toUpperCase());
  }

  return params;
}

function paramsList (params) {
  return `<${String(params)}>`;
}

function generateArglist (params) {
  const args = [];
  for (let i = 0, stop = Math.max(1, params.length - 1); i < stop; i++) {
    const input = params[i];
    const output = params[i + 1];
    args.push(`f${i}: FN<${input},${output}>`);
  }

  return `(${String(args)})`;
}

function arity (n) {
  const params = generateParams(n);
  const alist = generateArglist(params);
  const In = params[0];
  const Out = params[params.length - 1];

  return `<${String(params)}>${alist} => FN<${In}, ${Out}>`;
}


// ----------- Writes to stdout ---------------

console.log('// @flow');
console.log('// Automatically generated composer typedef');

console.log('declare var compfunc =');
for (let i = 2; i < 20; i++) {
  const line = arity(i);
  console.log(`  & (${line})`);
}
console.log(';');
