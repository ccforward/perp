const fs = require('fs')
const split = require('split')
const lineCount =  (filePath) => {
  let lines = 0
  return new Promise((resolve, reject) => {
    fs
      .createReadStream(filePath)
      .pipe(split())
      .on('data', (line) => {
        lines++
      })
      .on('end', () => {
        resolve(lines - 1)
      })
      .on('error', e => {
        reject(0)
      })
  })
}

module.exports = lineCount