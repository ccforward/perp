const url = require('url')
const querystring = require('querystring')
const DateCalc = require('date-calc')
const PerfDAO = require('../models/performance')
const LatestPerfDAO = require('../models/latest-performance')
const perfDAO = new PerfDAO()
const latestPerfDAO = new LatestPerfDAO()

const dateCalc = new DateCalc()
const parseResult = result => {
  const results = []
  for(let re of result) {
    const perf = {
      link: re.link,
      ua: re.ua,
      ip: re.ip,
      title: re.title,
      size: re.size,
      referer: re.referer,
      time: dateCalc.time(re.timestamp),
      
      total: re.total,
      domReady: re.domReady,
      readyStart: re.readyStart,
      redirect: re.redirect,
      appcache: re.appcache,
      unloadEvent: re.unloadEvent,
      dnsLookup: re.dnsLookup,
      connect: re.connect,
      request: re.request,
      initDomTree: re.initDomTree,
      loadEvent: re.loadEvent,
      
      other: re.other,
      os: re.os,
      dtime: re.dtime,
      date: dateCalc.time(re.date)
    }
    results.push(perf)
  }
  return results
}
module.exports = {
  async search(ctx, next) {
    const params = querystring.parse(url.parse(ctx.req.url).query)
    const page = parseInt(params.page || 1, 10)
    const limit = parseInt(params.limit || 20, 10)
    if(page<=0 || isNaN(page) || isNaN(limit)) {
      ctx.body = {
        err: 1,
        msg: 'Parameters Error'
      }
      return
    }
    let offset = (page-1)*limit
    let query = {}
    let total = 0
    let perfs = []

    if(ctx.params.day) {
      query.dtime = ctx.params.day
    }
    if(ctx.params.month) {
      query.dmonth = ctx.params.month
    }
    if(ctx.params.os) {
      query.os = ctx.params.os
    }
    if(ctx.params.link) {
      query.link = decodeURIComponent(ctx.params.link)
    }

    if(params.days) {
      let d = dateCalc.now()
      const days = []
      let i = 0
      let l = params.days
      for(;i<l;i++) {
        d = new DateCalc(d).before()
        days.push(d)
      }
      ctx.params.day = `${days[0]} - ${days[l-1]}`
      query.dtime = {
        $in: days
      }
    }

    console.log(query)

    if(~ctx.req.url.indexOf('/latest')) {
      total = await latestPerfDAO.count(query)
      perfs = parseResult(await latestPerfDAO.search(query, offset, limit))
    }else {
      total = await perfDAO.count(query)
      perfs = parseResult(await perfDAO.search(query, offset, limit))
    }
    ctx.body = {
      err: 0,
      page: {
        total: Math.ceil(total/limit)
      },
      data: {
        date: ctx.params.day || dateCalc.now(),
        perfs: perfs
      }
    }
  }
}