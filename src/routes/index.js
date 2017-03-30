const Router = require('koa-router')
const index = require('../controller/index')
const report = require('../controller/report')

const router = Router()

console.log(index)



router.get('/', index.index)
router.get('/example', index.example)

// errors report
router.get('/report/errors', report.errors)

module.exports = router
