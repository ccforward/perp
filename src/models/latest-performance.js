const perfSchema = require('./schema/perf')
const DAO = require('./dao')

class PerfDAO extends DAO {
  constructor() {
    super('LatestPerfs', perfSchema)
  }
}

module.exports = PerfDAO