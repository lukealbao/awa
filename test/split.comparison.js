'use strict';

const {
  into,
  split,
  eventStream
} = require('../');
const fs = require('fs');
const split2 = require('split2');

(async () => {
  const file = fs.createReadStream(__dirname + '/words1.txt', {
    encoding: 'utf8'
  });
  const stream = eventStream(file, 'data', 'end');
  const lines = split(x => x.split(/\n/), stream);
  let x = 0;
  file.on('data', _ => x+=1);
  
  const start = process.hrtime();
  const output = await into([], lines);  
  const end = process.hrtime(start);
  
  const latency = end[0] + end[1]/1e9;

  console.log(`[Awa] Read ${output.length} lines in ${latency} seconds`);
  console.log(`${x} data events`);
})();

// (() => {
//   const lines = [];
//   let start;
//   const file = fs.createReadStream(__dirname + '/words2.txt', {
//     encoding: 'utf8'
//   });
//   file.pause();
//   file.pipe(split2(/\n/))
//     .on('data', d => lines.push(d))
//     .on('end', _ => {      
//       const end = process.hrtime(start);
//       const latency = end[0] + end[1]/1e9;
//       console.log(`[Split2] Read ${lines.length} `
//                   + `lines in ${latency} seconds`);
//     });
//   start = process.hrtime();
//   file.resume();  
// })();


// (async () => {  
//   const start = process.hrtime();
  
//   const file = fs.readFileSync(__dirname + '/words3.txt', {
//     encoding: 'utf8'
//   }).split(/\n/);
  
//   let n = 0;
  
//   for (let line of file) {
//     line = await line;
//     n += 1;
//   }
  
//   const end = process.hrtime(start);
//   const latency = end[0] + end[1]/1e9;

//   console.log(`[AsyncDataEvent] Read ${n} lines `
//               + `in ${latency} seconds`);
// })();

// (async () => {  
//   const start = process.hrtime();
  
//   const file = fs.readFileSync(__dirname + '/words3.txt', {
//     encoding: 'utf8'
//   }).split(/\n/);
  
//   let n = 0;
  
//   for (let line of file) {
//     line = line;
//     n += 1;
//   }
  
//   const end = process.hrtime(start);
//   const latency = end[0] + end[1]/1e9;

//   console.log(`[SyncDataEvent] Read ${n} lines `
//               + `in ${latency} seconds`);
// })();

// (() => {
//   let lines = [];
//   let start;
//   const file = fs.createReadStream(__dirname + '/words4.txt', {
//     encoding: 'utf8'
//   });
  
//   file.pause();
//   file
//     .on('data', d => lines = lines.concat(d.split(/\n/)))
//     .on('end', _ => {      
//       const end = process.hrtime(start);
//       const latency = end[0] + end[1]/1e9;
//       console.log(`[StreamingReadSplit] Read ${lines.length} `
//                   + `lines in ${latency} seconds`);
//     });
//   start = process.hrtime();
//   file.resume();  
// })();
