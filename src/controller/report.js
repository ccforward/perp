const url = require('url')
const querystring = require('querystring')
const platform = require('platform')
const _ = require('lodash')
const log4js = require('log4js')
const DateCalc = require('date-calc')
const Task = require('../task')

const loggerErr = log4js.getLogger('errors')
const loggerPerf = log4js.getLogger('performance')

const parseParams = params => {
  const param = querystring.parse(params)
  
  const info = platform.parse(param.ua)
  param.os = info.os.family || 'unknown'

  const date = new DateCalc()
  param.dmonth = date.month()
  param.dtime = date.now()
  param.date = new Date().getTime()
  delete param.unique

  return param
}

let errCache = []
const errCacheSize = 5
// 定时扫描 errCache
// Task.scan(errCache)

const Report = {
  // 上报异常日志
  async errors(ctx, next) {
    const params = parseParams(url.parse(ctx.req.url).query)

    loggerErr.error(JSON.stringify(params))

    // save to error log cache
    if(errCache.length < errCacheSize) {
      const err = _.find(errCache, {link: param.link})
      if(err){
        ++err.count
      }else {
        errCache.push({
          link: param.link,
          msg: param.msg,
          count: 1
        })
      }
    }else {
      errCache.pop()
    }

    // sort by count 
    errCache = _.sortBy(errCache, ['count']).reverse()
    global.errCache = errCache

    ctx.body = {err:0}
  },

  // 上报性能日志
  async performance(ctx, next) {
    const params = parseParams(url.parse(ctx.req.url).query)
    loggerPerf.error(JSON.stringify(params))
    ctx.body = {err:0}
  }
}
module.exports = Report
