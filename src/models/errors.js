const mongodb = require('../config/mongo')

const Schema = mongodb.mongoose.Schema
const ErrorsSchema = new Schema({
  id: String,
  title: String
})

let Errors = {}

if(mongodb.mongoose.models.Errors){
  Errors = mongodb.mongoose.model('Errors')
}else {
  Errors = mongodb.mongoose.model('Errors', ErrorsSchema)
}
// Errors = mongodb.mongoose.model('Errors', ErrorsSchema)

class ErrorsDAO {
  insert(obj){
    return new Promise((resolve, reject) => {
      const instance = new Errors(obj)
      instance.save(err => {
        if(err){
          console.log(err)
          return reject(err)
        }
        return resolve()
      })
    })
  }

  search(query){
    return new Promise((resolve, reject) => {
      Errors.find(query, (err, data) => {
        if(err) return reject(err)
        let result = []
        resolve(result)
      })
    })
  }

}


module.exports = ErrorsDAO