const url = require('url')
const querystring = require('querystring')

const loggerErr = require('log4js').getLogger('errors')

const Report = {
  async errors(ctx, next) {
    const param = querystring.parse(url.parse(ctx.req.url).query)
    const title = 'report errors'

    loggerErr.error(JSON.stringify(param))


    ctx.body = {s:0}
    // await ctx.render('index', {
    //   title
    // })
  }
}
module.exports = Report
