const log4js = require('log4js')
const mongoose = require('../config/mongo')
const loggerSys = log4js.getLogger('sys')

class DAO {
  constructor(collection, schema) {
    this.collection = collection
    this.Model = mongoose.model(this.collection, new mongoose.Schema(schema))
  }

  insertMany(errs) {
    return new Promise((resolve, reject) => {
      this.Model.insertMany(errs, (err, docs) => {
        if(err){
          loggerSys.error(err)
          reject(false)
        }
        resolve(true)
      })
    }).catch(err => {
      loggerSys.error(err)
      console.log(err)
    })
  }

  count(query={}){
    return new Promise((resolve, reject) => {
      this.Model.count(query, (err, data) => {
        if(err) {
          reject(false)
          loggerSys.error(err)
        }
        resolve(data)
      })
    }).catch(err => {
      loggerSys.error(err)
      console.log(err)
    })
  }

  search(query={}, offset=0, limit=20) {
    return new Promise((resolve, reject) => {
      this.Model.find(query).sort({_id: 'desc'}).skip(offset).limit(limit).exec((err, data) => {
        if(err) {
          reject(false)
          loggerSys.error(err)
        }
        resolve(data)
      })
    }).catch(err => {
      loggerSys.error(err)
      console.log(err)
    })
  }
}


module.exports = DAO