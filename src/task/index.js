const fs = require('fs')
const CronJob = require('cron').CronJob
const DateCalc = require('date-calc')
const log4js = require('log4js')
const transporter = require('../util/mail')
const lineCount = require('../util/line-count')
const mail = require('../config').mail
const ErrorsDAO = require('../models/errors')
const PerfDAO = require('../models/performance')
const LatestErrorsDAO = require('../models/latest-errors')
const LatestPerfDAO = require('../models/latest-performance')


const loggerErr = log4js.getLogger('errors')
const loggerPerf = log4js.getLogger('performance')
const loggerSys = log4js.getLogger('sys')
const errorsDAO = new ErrorsDAO()
const perfDAO = new PerfDAO()
const latestErrorsDAO = new LatestErrorsDAO()
const latestPerfDAO = new LatestPerfDAO()

const errorLog = './logs/error/errors.log'
const perfLog = './logs/performance/perf.log'

// 报警通知次数
const informTag = {
  scan: 1
}
// 相同错误出现x次后发送报警邮件
const errCount = 10

const mailOptions = {
  from: mail.user,
  to: mail.to,
  subject: 'FrontEnd Error Alert',
  text: 'FrontEnd Error Alert',
  html: '<h1>FrontEnd Error 😲</h1><hr>'
}


const saveLog = async (start=1, logFile, dataDAO) => {
  const logArr = fs.readFileSync(logFile).toString().trim().split('\n')
  const eachCount = 100 // 每次批量存储 100 条日志
  let saveLogs = []
  let i = start
  let l = logArr.length
  let saveTimes = 0 // insertMany次数
  const totalTimes = Math.ceil(l/eachCount) // 总存储次数
  for(; i<=l; i++) {
    const log = logArr[i-1]
    if(log.length) {
      try {
        saveLogs.push(JSON.parse(log))
        if(i%eachCount == 0) {
          if(await dataDAO.insertMany(saveLogs)){
            saveTimes++
            saveLogs = []
          }
        }
        if(i == l && totalTimes == saveTimes+1) {
          await dataDAO.insertMany(saveLogs)
        }
      }catch(e) {
        loggerSys.error(e)
        console.log(e)
      }
    }
  }
}

const checkLog = (logFile, logger, dataDAO) => {
  if(fs.existsSync(logFile)){
    saveLog(1, logFile, dataDAO)
  }else {
    logger.info()
    setTimeout(()=>{
      checkLog(logFile)
    }, 2000)
  }
}

const checkLatest = async (logFile, type, dataDAO) => {
  const globalLine = type == 'error' ? global.logLines.error : global.logLines.performance
  const errorLines = await lineCount(logFile)
  if(errorLines > globalLine) {
    // 添加日志
    saveLog(globalLine+1, logFile, dataDAO)
    type == 'error' ? (global.logLines.error = errorLines) : (global.logLines.performance = errorLines)
  }
  if(errorLines < globalLine) {
    // 重置数据库最新日志
    await dataDAO.remove()
    type == 'error' ? (global.logLines.error = 0) : (global.logLines.performance = 0)
  }
}


module.exports = {
  // 每 5min 定时扫描 errCache中的count  是否存在所无数大于 errCount 的
  scan() {
    new CronJob('* 5 * * * *', () => {
      if(global.errCache) {
        const errCache = global.errCache
        for(let er of errCache){
          // 邮件通知
          if(er.count >= errCount){
            if(informTag.scan == 1){
              informTag.scan++
              let html = `
                  <p>Error Link: <b>${er.link}</b></p>
                  <p>Error Msg: <b>${er.msg}</b></p>
              `
              mailOptions.html += html
              transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                  return console.log(new Date() + ' ' + error);
                }
              })
            }
          }
          // 短信通知-调API
          // 
        }
      }
    }, null, true, 'Asia/Shanghai')
  },

  // 每 3min 定时扫描最新日志并存入 latest
  async latest() {
    new CronJob('* 3 * * * *', () => {
      checkLatest(errorLog, 'error', latestErrorsDAO)
      checkLatest(perfLog, 'perf', LatestPerfDAO)
    }, null, true, 'Asia/Shanghai')
  },

  // 每天 00:05 处理前一天异常、性能日志
  daily() {
    new CronJob('00 05 00 * * *', () => {
      const d = new DateCalc()
      checkLog(`${errorLog}-${d.before()}`, loggerErr, errorsDAO)
      checkLog(`${perfLog}-${d.before()}`, loggerPerf, perfDAO)
    }, null, true, 'Asia/Shanghai');
  }
}