const fs = require('fs')
const asyncBusboy = require('async-busboy')
const sourceMap = require('source-map')


const Translate = {
  async index(ctx, next) {
    await ctx.render('translate')
  },

  // 翻译源码的原始 line column
  async parse(ctx, next) {
    const {files, fields} = await asyncBusboy(ctx.req)
    let map 
    let origin = {}
    let sourcemapLink = ''
    for(let f of files) {
      if(f.fieldname == 'sourcemap') {
        map = fs.readFileSync(f.path)
        sourcemapLink = f.path
      }
    }

    const consumer = new sourceMap.SourceMapConsumer(map.toString())
    origin = consumer.originalPositionFor({
      line: parseInt(fields.line, 10),
      column: parseInt(fields.col,10)
    })
    fs.unlink(sourcemapLink, _=>{})

    ctx.body = {
      err: 0,
      data: {
        origin
      }
    }
  },

  // 展示源码具体信息
  async source(ctx, next) {
    const {files, fields} = await asyncBusboy(ctx.req)
    let sourceFile = ''
    let sourceLink = ''
    let sourceCode = ''
    for(let f of files) {
      if(f.fieldname == 'source') {
        sourceFile = fs.readFileSync(f.path).toString()
        sourceLink = f.path
      }
    }

    const numbers = 10 // 当前错误行前后显示源码行数
    const line = parseInt(fields.line, 10)
    const sourceLines = sourceFile.split('\n')
    const total = sourceLines.length - 1

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
      const rex = /\<|\>|\"|\'|\&/g  
      const code = sourceLines[i].replace(rex, match => {    
          switch(match){    
            case "<":    
              return "&lt;"
              break
            case ">":    
              return "&gt;"
              break
            case "\"":    
              return "&quot;"
              break
            case "'":    
              return "&#39;"
              break
            case "&":    
              return "&amp;"
              break
            default :    
              break
          }
        })
      sourceCode += `<li data-no=${i}><pre>${code}</pre></li>`
    }

    fs.unlink(sourceLink, _=>{})

    ctx.body = {
      err: 0,
      data: {
        start: start,
        end: end,
        source: sourceCode
      }
    }
  }
}


module.exports = Translate