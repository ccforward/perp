const fs = require('fs')
const CronJob = require('cron').CronJob
const DateCalc = require('date-calc')
const loggerErr = require('log4js').getLogger('errors')
const transporter = require('../util/mail')
const mail = require('../config').mail

const informTag = {
  scan: 1
}
const mailOptions = {
  from: mail.user,
  to: mail.to,
  subject: 'FrontEnd Error Alert',
  text: 'FrontEnd Error Alert',
  html: '<h1>FrontEnd Error 😲</h1><hr>'
}

const parseLog = logFile => {
  const logArr = fs.readFileSync(logFile).toString().split('\n')
  for(let l of logArr) {
    const log = l.split(' - ')
    if(log[0].indexOf('[ERROR]')>0){
      try {
        console.log(JSON.parse(log[1]))
      }catch(e) {
        console.log(e)
      }
    }
  }
}

const checkLog = logFile => {
  if(fs.existsSync(logFile)){
    parseLog(logFile)
  }else {
    console.log('no log file')
    loggerErr.info()
    console.log('create log file')
    setTimeout(()=>{
      checkLog(logFile)
    }, 2000)
  }
}


module.exports = {
  // 定时扫描 errCache中的count  是否存在大于 5 的
  scan() {
    new CronJob('*/3 * * * * *', () => {
      let errCache = global.errCache
      for(let er of errCache){
        // 邮件通知
        if(er.count >= 3){
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

        // 短信通知
        // if(er.count >= 100){

        // }
      }
    }, null, true, 'Asia/Shanghai')
  },

  // 每天 00:05 处理前一天日志任务
  daily() {
    const d = new DateCalc()
    checkLog(`./logs/error/errors.log-${d.before()}`)
    
    // new CronJob('00 05 00 * * *', () => {
    //   const d = new DateCalc()
    //   const logFile = `errors.log-${d.before()}`
    //   fs.readFileSync(`./logs/error/${logFile}`).toString().split
    // }, () => {
      
    // }, true, 'Asia/Shanghai');
  }
}