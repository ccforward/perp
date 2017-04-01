const mongoose = require('mongoose')

mongoose.Promise = global.Promise

const mongo = {
  name: 'perp', // Performance and Err Report Platform
  host: '127.0.0.1',
  port: 27017,
  username: 'cc',
  password: '12345',
  url: function() {
    return ['mongodb://',
      this.username, ':',
      this.password, '@',
      this.host, ':', this.port, '/', this.name
    ].join('')
  }
}
const mongoOptions = {
  server: {
    poolSize: 5,
    socketOptions: {
      auto_reconnect: true
    }
  }
}

// mongoose.disconnect()
// const Schema = mongoose.Schema
// const ErrsSchema = new Schema({
//   link: { type: String, index: true },
//   ua: String,
//   title: String,
//   size: String,
//   referer: String,
//   timestamp: String,
//   msg: String,
//   url: String,
//   line: String,
//   col: String,
//   errStack: String,
//   other: String,
//   date: Number
// })

// db.model('Errs', ErrsSchema)
// const db = mongoose.createConnection(mongo.url(), mongoOptions)
mongoose.connect(mongo.url(), mongoOptions)

module.exports = mongoose