const fs = require('fs')
const split = require('split')

module.exports = filePath => {
  let lines = 0
  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(split())
      .on('data', line => {
        lines++
      })
      .on('end', _ => {
        resolve(lines - 1)
      })
      .on('error', e => {
        reject(0)
      })
  })
}