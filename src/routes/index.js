const Router = require('koa-router')
const index = require('../controller/index')
const report = require('../controller/report')
const translate = require('../controller/translate')

const router = Router()

router.get('/', index.index)
router.get('/example', index.example)
router.get('/test', index.test)

// errors report
router.get('/report/errors', report.errors)
router.get('/report/performance', report.performance)


// translate
router.get('/translate/', translate.index)
router.post('/translate/parse', translate.parse)
router.post('/translate/source', translate.source)

module.exports = router
