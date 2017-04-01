const mongoose = require('../config/mongo')

const Schema = mongoose.Schema
const ErrsSchema = new Schema({
  link: { type: String, index: true },
  os: { type: String, index: true },
  ua: String,
  title: String,
  size: String,
  referer: String,
  timestamp: String,
  msg: String,
  url: String,
  line: String,
  col: String,
  errStack: String,
  other: String,
  dtime: { type: String, index: true },
  dmonth: String,
  date: Number
})

const Errs = mongoose.model('Errs', ErrsSchema)

class ErrsDAO {
  insertMany(errs){
    return new Promise((resolve, reject) => {
      Errs.insertMany(errs, (err, docs) => {
        if(err){
          reject(false)
        }
        resolve(true)
      })
    })
  }

  search(query){
    return new Promise((resolve, reject) => {
      Errs.find(query, (err, data) => {
        if(err) return reject(err)
        let result = []
        resolve(result)
      })
    })
  }

}


module.exports = ErrsDAO