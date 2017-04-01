const http = require('http')
const Koa = require('koa')
const path = require('path')
const views = require('koa-views')
const convert = require('koa-convert')
const json = require('koa-json')
const bodyparser = require('koa-bodyparser')
const compress = require('koa-compress')
const logger = require('koa-logger')
const koaStatic = require('koa-static')
const koaOnError = require('koa-onerror')
// const staticCache = require('koa-static-cache')
const config = require('./config')

const app = new Koa()


// webpack for fe develop
if(config.fe){
  const webpackConfig = require('../build/webpack.dev.conf')
  const webpack = require('webpack')
  const webpackDevMiddleware = require('koa-webpack-dev-middleware')
  const compiler = webpack(webpackConfig)
  const devMiddleware = webpackDevMiddleware(compiler, {
    publicPath: webpackConfig.output.publicPath,
    stats: {
      colors: true,
      chunks: true,
      progress: true
    }
  })
  const hotMiddleware = require('koa-webpack-hot-middleware')(compiler)
  app.use(devMiddleware)
  app.use(hotMiddleware)
}


// middlewares
app.use(convert(bodyparser()))
app.use(convert(json()))
app.use(logger())


// views
app.use(views(path.join(__dirname, '../views'), {
  extension: 'ejs'
}))

// log
const log4js = require('log4js');
log4js.loadAppender('file');
log4js.configure({
  appenders: [
    {
      type: 'DateFile',
      filename: './logs/error/errors.log',
      pattern: "-yyyyMMdd",
      category: 'errors',
      layout: {
        type: 'pattern',
        pattern: "%m"
      }
    },
    {
      type: 'DateFile',
      filename: './logs/performance/perf.log',
      pattern: "-yyyyMMdd",
      category: 'performance',
      layout: {
        type: 'pattern',
        pattern: "%m"
      }
    },
    {
      type: 'file',
      filename: './logs/system/sys.log',
      category: 'sys'
    }
  ]
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

app.use(compress({
  threshold: 2048,
  flush: require('zlib').Z_SYNC_FLUSH
}))

// app.use(staticCache(path.join(__dirname, '../public'), {
//   maxAge: 10 * 24 * 60 * 60
// }))

// static
app.use(koaStatic(path.join(__dirname, '../public'), {
  pathPrefix: ''
}))

// 500 error
koaOnError(app, {
  template: 'views/500.ejs'
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
