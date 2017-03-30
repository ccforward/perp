const fs = require('fs')
const sourceMap = require('source-map')

const map = fs.readFileSync('./test/main.bundle.js.map')




var consumer = new sourceMap.SourceMapConsumer(map.toString());

const origin = consumer.originalPositionFor({ line: 1, column: 751 })

// console.log(origin.source)
// console.log(origin.line)
// console.log(origin.column)

const line = origin.line

const source = fs.readFileSync('./test/main.js').toString()
const sourceLines = source.split('\n')
const total = sourceLines.length - 1
const numbers = 8

let start = 0
let end = 0


if(line - numbers >= 0) {
  start = line - numbers
}else {
  start = 0
}

if(line + numbers <= total) {
  end = line + numbers
}else {
  end = total
}

for(let i=start;i<=end;i++){
  console.log(i+ ': ' + sourceLines[i])
}





