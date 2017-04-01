const fs = require('fs')
const _ = require('lodash')
const defaultConfig = require('./default')

const cfgs = []
fs.readdirSync(__dirname).map(filename => {
  if (filename === 'index.js' || filename === 'mongo.js' || filename === 'mail.sample') {
    return false
  }
  try {
    const cfg = require('./' + filename)
    if (_.isPlainObject(cfg)) {
      cfgs.push(cfg)
    }
  } catch (e) {}
})
cfgs.push(defaultConfig)

const config = _.defaultsDeep.apply(_, cfgs)
module.exports = config
