const log4js = require('log4js')
const mongoose = require('../config/mongo')
const loggerSys = log4js.getLogger('sys')
const errSchema = require('./schema/error')

const Schema = mongoose.Schema
const ErrsSchema = new Schema(errSchema)
const Errs = mongoose.model('Errs', ErrsSchema)

class ErrsDAO {
  insertMany(errs){
    return new Promise((resolve, reject) => {
      Errs.insertMany(errs, (err, docs) => {
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
  count(){
    return new Promise((resolve, reject) => {
      Errs.count(query, (err, data) => {
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

  search(query, offset=0, limit=20){
    return new Promise((resolve, reject) => {
      Errs.find(query).skip(offset).limit(limit).exec((err, data) => {
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


module.exports = ErrsDAO