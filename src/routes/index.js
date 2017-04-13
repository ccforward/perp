const Router = require('koa-router')
const index = require('../controller/index')
const report = require('../controller/report')
const translate = require('../controller/translate')
const errs = require('../controller/errors')
const perf = require('../controller/performance')

const router = Router()

router.get('/', index.index)
// router.get('/example', index.example)

// 日志列表页面
router.get('/logs/errors', index.errors)
router.get('/logs/performance', index.performance)
// 源码翻译页
router.get('/translate/', translate.index)
router.get('/translate.html/', translate.index)

// errors report
router.get('/report/errors', report.errors)
router.get('/report/performance', report.performance)


// ================= API =================

// 准实时最新日志查询
router.get('/errors/latest', errs.search)
router.get('/performance/latest', perf.search)


// errors 多维度查询
router.get('/errors/day/:day', errs.search)
router.get('/errors/month/:month', errs.search)
router.get('/errors/os/:os', errs.search)
router.get('/errors/link/:link', errs.search)

// performance 多维度查询
router.get('/performance/day/:day', perf.search)
router.get('/performance/month/:month', perf.search)
router.get('/performance/os/:os', perf.search)
router.get('/performance/link/:link', perf.search)


// translate
router.post('/translate/parse', translate.parse)
router.post('/translate/source', translate.source)

module.exports = router
