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
  }
}


module.exports = Index