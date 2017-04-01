const Task = require('../task')

const Index = {
  async index(ctx, next) {
    const title = 'koa2 title'
    await ctx.render('index', {
      title
    })
  },

  async example(ctx, next) {
    const title = 'report example'
    await ctx.render('example', {
      title
    })
  },

  async test(ctx, next){
    ctx.body = 'test'
  }
}


module.exports = Index