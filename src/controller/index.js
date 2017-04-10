const task = require('../task/index')
const Index = {
  async index(ctx, next) {
    const title = 'koa2 title'
    await ctx.render('index', {
      title
    })
  },

  async example(ctx, next) {
    task.latest()
    const title = 'report example'
    await ctx.render('example', {
      title
    })
  },

  async errors(ctx, next) {
    ctx.body = 'errors'
  },
  async performance(ctx, next) {
    ctx.body = 'performance'
  }
}


module.exports = Index