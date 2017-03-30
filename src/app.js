const http = require('http')
const Koa = require('koa')
const path = require('path')
const views = require('koa-views')
const convert = require('koa-convert')
const json = require('koa-json')
const Bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const koaStatic = require('koa-static')
const koaOnError = require('koa-onerror')
const staticCache = require('koa-static-cache')
const config = require('./config')

const app = new Koa()
const bodyparser = Bodyparser()


// log
const log4js = require('log4js');
log4js.loadAppender('file');
log4js.configure({
  appenders: [
    { type: 'console' },
    {
      type: 'DateFile',
      filename: './log/error/errors.log',
      pattern: "-yyyyMMdd",
      category: 'errors'
    },
    // { type: 'DateFile', filename: './log/performance.log', category: 'performance' }
  ]
})

// middlewares
app.use(bodyparser)
app.use(convert(json()))
app.use(logger())
app.use(staticCache(path.join(__dirname, '../public'), {
  maxAge: 10 * 24 * 60 * 60
}))

// static
app.use(koaStatic(path.join(__dirname, '../public'), {
  pathPrefix: ''
}))

// views
app.use(views(path.join(__dirname, '../views'), {
  extension: 'ejs'
}))

// 500 error
koaOnError(app, {
  template: 'views/500.ejs'
})

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// response router
app.use(async (ctx, next) => {
  await require('./routes').routes()(ctx, next)
})


// 404
app.use(async (ctx) => {
  ctx.status = 404
  await ctx.render('404')
})

// error logger
app.on('error', async (err, ctx) => {
  console.log('error occured:', err)
})

const port = parseInt(config.port || '8003')
const server = http.createServer(app.callback())

server.listen(port)
server.on('error', (error) => {
  if (error.syscall !== 'listen') {
    throw error
  }
  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(port + ' requires elevated privileges')
      process.exit(1)
      break
    case 'EADDRINUSE':
      console.error(port + ' is already in use')
      process.exit(1)
      break
    default:
      throw error
  }
})
server.on('listening', () => {
  console.log('Listening on port: %d', port)
})

module.exports = app
