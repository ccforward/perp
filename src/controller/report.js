const url = require('url')
const querystring = require('querystring')
const _ = require('lodash')
const loggerErr = require('log4js').getLogger('errors')
const Task = require('../task')

// const errCache = new cache(100)
let errCache = []
const errCacheSize = 5

// 定时扫描 errCache
// Task.scan(errCache)

const Report = {
  async errors(ctx, next) {
    const param = querystring.parse(url.parse(ctx.req.url).query)
    const title = 'report errors'

    // loggerErr.info()

    // save to error log cache
    // if(errCache.length < errCacheSize) {
    //   const err = _.find(errCache, {link: param.link})
    //   if(err){
    //     ++err.count
    //   }else {
    //     errCache.push({
    //       link: param.link,
    //       msg: param.msg,
    //       count: 1
    //     })
    //   }
    // }else {
    //   errCache.pop()
    // }

    // sort by count 
    // errCache = _.sortBy(errCache, ['count']).reverse()
    // global.errCache = errCache
    ctx.body = {s:0}
    Task.daily()

    // await ctx.render('index', {
    //   title
    // })
  }
}
module.exports = Report
