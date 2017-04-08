const url = require('url')
const querystring = require('querystring')
const DateCalc = require('date-calc')
const ErrorsDAO = require('../models/errors')
const errorsDAO = new ErrorsDAO()

const dateCalc = new DateCalc()
const parseResult = result => {
  const errs = []
  for(let re of result) {
    const err = {
      link: re.link,
      ua: re.ua,
      ip: re.ip,
      title: re.title,
      size: re.size,
      referer: re.referer,
      time: dateCalc.time(re.timestamp),
      msg: re.msg,
      url: re.url,
      line: re.line,
      col: re.col,
      errStack: re.errStack,
      other: re.other,
      os: re.os,
      dtime: re.dtime,
      date: dateCalc.time(re.date)
    }
    errs.push(err)
  }
  return errs
}
module.exports = {
  async search(ctx, next) {
    const params = querystring.parse(url.parse(ctx.req.url).query)
    let query = {}
    if(ctx.params.day) {
      query = {
        dtime: ctx.params.day
      }
    }
    if(ctx.params.month) {
      query = {
        dmonth: ctx.params.month
      }
    }
    if(ctx.params.os) {
      query = {
        os: ctx.params.os
      }
    }
    if(ctx.params.link) {
      query = {
        link: decodeURIComponent(ctx.params.link)
      }
    }
    const offset =  params.offset || 0
    const limit =  params.limit || 20
    const errs = parseResult(await errorsDAO.search(query, offset, limit))
    ctx.body = {
      err: 0,
      page: {
        offset: 0,
      },
      data: {errs}
    }
  }
}