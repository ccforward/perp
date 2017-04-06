const fs = require('fs')
const CronJob = require('cron').CronJob
const DateCalc = require('date-calc')
const log4js = require('log4js')
const transporter = require('../util/mail')
const mail = require('../config').mail
const ErrorsDAO = require('../models/errors')
const PerfDAO = require('../models/performance')


const loggerErr = log4js.getLogger('errors')
const loggerPerf = log4js.getLogger('performance')
const loggerSys = log4js.getLogger('sys')
const errorsDAO = new ErrorsDAO()
const perfDAO = new PerfDAO()

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


const saveLog = async (logFile, dataDAO) => {
  const logArr = fs.readFileSync(logFile).toString().trim().split('\n')
  const eachCount = 100 // 每次批量存储 100 条日志
  let saveLogs = []
  let i = 1
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
    saveLog(logFile, dataDAO)
  }else {
    logger.info()
    setTimeout(()=>{
      checkLog(logFile)
    }, 2000)
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
          // TODO 短信通知-直接调接口
        }
      }
    }, null, true, 'Asia/Shanghai')
  },

  // 每天 00:05 处理前一天异常、性能日志
  daily() {
    // const d = new DateCalc()
    // checkLog(`./logs/error/errors.log-${d.before()}`, loggerErr, errorsDAO)
    new CronJob('00 05 00 * * *', () => {
      const d = new DateCalc()
      checkLog(`./logs/error/errors.log-${d.before()}`, loggerErr, errorsDAO)
      checkLog(`./logs/performance/perf.log-${d.before()}`, loggerPerf, perfDAO)
    }, null, true, 'Asia/Shanghai');
  }
}