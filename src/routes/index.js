const Router = require('koa-router')
const index = require('../controller/index')
const report = require('../controller/report')
const translate = require('../controller/translate')
const errs = require('../controller/errors')

const router = Router()

router.get('/', index.index)
router.get('/example', index.example)

// 日志列表页面
router.get('/logs/errors', index.errors)
router.get('/logs/performance', index.performance)

// errors report
router.get('/report/errors', report.errors)
router.get('/report/performance', report.performance)


// ================= API =================

// errors 多维度查询
router.get('/errors/day/:day', errs.search)
router.get('/errors/month/:month', errs.search)
router.get('/errors/os/:os', errs.search)
router.get('/errors/link/:link', errs.search)


// translate
router.get('/translate/', translate.index)
router.post('/translate/parse', translate.parse)
router.post('/translate/source', translate.source)

module.exports = router
