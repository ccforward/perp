const mongoose = require('../config/mongo')
const log4js = require('log4js')
const Schema = mongoose.Schema
const PerfSchema = new Schema({
  link: { type: String, index: true },
  os: { type: String, index: true },
  ua: String,
  title: String,
  size: String,
  referer: String,
  timestamp: String,
  total: String,
  domReady: String,
  readyStart: String,
  redirect: String,
  appcache: String,
  unloadEvent: String,
  dnsLookup: String,
  connect: String,
  request: String,
  initDomTree: String,
  loadEvent: String,
  other: String,
  dtime: { type: String, index: true },
  dmonth: String,
  date: Number
})

const Perf = mongoose.model('Perfs', PerfSchema)
const loggerSys = log4js.getLogger('sys')

class PerfDAO {
  insertMany(errs){
    return new Promise((resolve, reject) => {
      Perf.insertMany(errs, (err, docs) => {
        if(err){
          loggerSys.error(err)
          reject(false)
        }
        resolve(true)
      })
    })
  }

  search(query){
    return new Promise((resolve, reject) => {
      Perf.find(query, (err, data) => {
        if(err) {
          loggerSys.error(err)
          reject([])
        }
        let result = []
        resolve(result)
      })
    })
  }
}


module.exports = PerfDAO