const mongoose = require('../config/mongo')
const log4js = require('log4js')
const loggerSys = log4js.getLogger('sys')
const perfSchema = require('./schema/perf')

const Schema = mongoose.Schema
const PerfSchema = new Schema(perfSchema)
const Perf = mongoose.model('LatestPerfs', PerfSchema)

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

  remove(query = {}){
    return new Promise((resolve, reject) => {
      Errs.remove(query, (err, data) => {
        if(err) {
          reject(false)
          loggerSys.error(err)
        }
        resolve(data)
      })
    })
  }
}


module.exports = PerfDAO