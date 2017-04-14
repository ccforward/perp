const perfSchema = require('./schema/perf')
const DAO = require('./dao')

class PerfDAO extends DAO {
  constructor() {
    super('Perfs', perfSchema)
  }
}

module.exports = PerfDAO