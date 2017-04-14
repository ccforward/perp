const errSchema = require('./schema/error')
const DAO = require('./dao')

class ErrsDAO extends DAO {
  constructor() {
    super('LatestErrs', errSchema)
  }
}

module.exports = ErrsDAO