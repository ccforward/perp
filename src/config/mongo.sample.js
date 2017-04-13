const mongoose = require('mongoose')

mongoose.Promise = global.Promise

const mongo = {
  name: 'perp', // Performance and Err Report Platform
  host: '127.0.0.1',
  port: 27017,
  username: 'username',
  password: 'password',
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
mongoose.connect(mongo.url(), mongoOptions)

module.exports = mongoose